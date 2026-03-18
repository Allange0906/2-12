import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import { unlink } from 'fs';
import { extname } from 'path';
import File from '../models/File';
import verifyToken from '../middleware/auth';

const router = Router();

const storage = diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + extname(file.originalname))
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

// 카테고리별 자료 조회 (로그인한 사람만 볼 수 있게 설정)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) query.category = category;
        const files = await File.find(query).sort({ uploadDate: -1 });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: "자료 조회 오류" });
    }
});

// 자료 업로드 (verifyToken 통과 -> upload.single 실행)
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        const newFile = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            size: req.file.size,
            uploaderId: req.user.id, // 👈 미들웨어에서 넘어온 유저 ID
            description: req.body.description,
            category: req.body.category
        });
        await newFile.save();
        res.status(201).json({ message: "업로드 성공", fileId: newFile._id });
    } catch (error) {
        res.status(500).json({ error: "업로드 오류" });
    }
});

// 필수 보존 토글 (반장이나 관리자만 가능하게 하려면 로직 추가 가능)
router.patch('/:id/essential', verifyToken, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        file.isEssential = !file.isEssential;
        await file.save();
        res.json({ message: "보존 설정 변경됨", isEssential: file.isEssential });
    } catch (error) {
        res.status(500).json({ error: "설정 변경 오류" });
    }
});

// 반장 코멘트 추가
router.patch('/:id/president-comment', verifyToken, async (req, res) => {
    if (req.user.role !== '반장') return res.status(403).json({ error: "반장만 가능합니다." });
    try {
        const file = await File.findById(req.params.id);
        file.presidentComment = req.body.presidentComment;
        await file.save();
        res.json({ message: "반장 코멘트 추가됨" });
    } catch (error) {
        res.status(500).json({ error: "코멘트 추가 오류" });
    }
});

// 자료 삭제 (본인 또는 반장/관리자)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "파일 없음" });

        if (file.uploaderId !== req.user.id && !['반장', '관리자'].includes(req.user.role)) {
            return res.status(403).json({ error: "삭제 권한이 없습니다." });
        }

        unlink(file.filePath, async (err) => {
            if (err && err.code !== 'ENOENT') return res.status(500).json({ error: "물리적 삭제 실패" });
            await File.findByIdAndDelete(req.params.id);
            res.json({ message: "파일 삭제됨" });
        });
    } catch (error) {
        res.status(500).json({ error: "삭제 오류" });
    }
});

export default router;