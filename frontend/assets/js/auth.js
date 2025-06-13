// frontend/assets/js/auth.js (phiên bản đơn giản với localStorage)
export async function login(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("token", `dummy.${btoa(JSON.stringify(user))}.dummy`);
    return { success: true, user };
  } else {
    return {
      success: false,
      message: "Tên đăng nhập hoặc mật khẩu không đúng",
    };
  }
}

export async function register(username, email, password, confirmPassword) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (password !== confirmPassword) {
    return { success: false, message: "Mật khẩu không khớp" };
  }
  if (users.some((u) => u.username === username)) {
    return { success: false, message: "Tên đăng nhập đã tồn tại" };
  }
  if (users.some((u) => u.email === email)) {
    return { success: false, message: "Email đã được sử dụng" };
  }
  const newUser = { username, email, password, role: "user" };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return { success: true, user: newUser };
}
