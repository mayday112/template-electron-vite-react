/**
 * Validates the login form data.
 * @param {string} email
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
export const validateLoginForm = (email, password) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  return null;
};

/**
 * Validates the post form data.
 * @param {string} title
 * @param {string} content
 * @returns {string|null} Error message or null if valid
 */
export const validatePostForm = (title, content) => {
  if (!title || !content) {
    return "Title and content are required";
  }
  return null;
};

/**
 * Validates the user form data.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {boolean} isEdit
 * @returns {string|null} Error message or null if valid
 */
export const validateUserForm = (name, email, password, isEdit = false) => {
  if (!name || !email || (!isEdit && !password)) {
    return "Name, email and password are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  return null;
};
