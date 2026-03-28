import { Link } from 'react-router-dom';
import logo from '../../assets/logo1.png';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b border-base-200 rounded-b-box sticky top-0 z-50 px-0">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost hover:bg-transparent">
          <img src={logo} alt="Bugil212" className="h-20 w-auto" />
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/login">로그인</Link></li>
            <li><Link to="/register">회원가입</Link></li>
            <li><Link to="/board/community">커뮤니티</Link></li>
            <li><Link to="/notice/class">공지사항</Link></li>
            <li><Link to="/menu">급식표</Link></li>
            <li><Link to="/timetable">시간표</Link></li>
            <li><Link to="/attend/yaja">출결 확인</Link></li>
            <li><Link to="/numberpicker">번호 뽑기</Link></li>
            <li><Link to="/calendar">학사일정</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
