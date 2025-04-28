const checkIsLogin = async () => {
  const token = localStorage.getItem('authToken') ?? '';
  if (token === '') {
    console.log('mana tokennya');
    return false;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_USER_SERVICE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log('Token tidak valid atau error dari backend');
      return false; // Atau throw error sesuai kebutuhan
    }
    return true; // Asumsikan backend mengembalikan sesuatu yang truthy jika token valid
  } catch (error) {
    console.error("Error saat memeriksa token:", error);
    return false;
  }
};

export default checkIsLogin;