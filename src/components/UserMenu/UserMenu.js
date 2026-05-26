import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, BookOpen, ClipboardList } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import './UserMenu.css';

export default function UserMenu() {
  const { user, isTeacher, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) {
    return <div className="user-menu__placeholder" aria-hidden />;
  }

  if (!user) {
    return (
      <Link to="/login" className="user-menu__login">
        <LogIn size={16} strokeWidth={2.25} />
        <span>Մտնել</span>
      </Link>
    );
  }

  const displayName = user.displayName || user.email.split('@')[0];
  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="user-menu__avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="user-menu__avatar user-menu__avatar--initials">
            {initials}
          </span>
        )}
        <span className="user-menu__name">{displayName}</span>
      </button>

      {open && (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__profile">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="user-menu__profileAvatar"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="user-menu__profileAvatar user-menu__avatar--initials">
                {initials}
              </span>
            )}
            <div className="user-menu__profileInfo">
              <div className="user-menu__profileNameRow">
                <span className="user-menu__profileName" title={displayName}>
                  {displayName}
                </span>
                {isTeacher && (
                  <span className="user-menu__badge">Ուսուցիչ</span>
                )}
              </div>
              <span className="user-menu__profileEmail" title={user.email}>
                {user.email}
              </span>
            </div>
          </div>

          <div className="user-menu__divider" />

          <Link
            to="/lessons"
            className="user-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <BookOpen size={16} />
            Դասեր
          </Link>
          {isTeacher && (
            <Link
              to="/grades"
              className="user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <ClipboardList size={16} />
              Գնահատականների մատյան
            </Link>
          )}

          <div className="user-menu__divider" />

          <button
            type="button"
            className="user-menu__item user-menu__item--danger"
            onClick={handleSignOut}
            role="menuitem"
          >
            <LogOut size={16} />
            Դուրս գալ
          </button>
        </div>
      )}
    </div>
  );
}
