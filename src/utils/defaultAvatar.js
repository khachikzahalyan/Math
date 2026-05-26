import studentAvatar from '../assets/avatars/student.svg';
import teacherAvatar from '../assets/avatars/teacher.svg';

export const STUDENT_AVATAR = studentAvatar;
export const TEACHER_AVATAR = teacherAvatar;

export function getDefaultAvatar(isTeacher) {
  return isTeacher ? teacherAvatar : studentAvatar;
}
