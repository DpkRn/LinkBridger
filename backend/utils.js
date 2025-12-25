const hashData = (data) => {
    const algorithm = 'aes-256-cbc';
    const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production-32chars!!';
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  };
  
  // Helper function to unhash/decrypt username and source
  const unhashData = (hashedData) => {
    try {
      const algorithm = 'aes-256-cbc';
      const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production-32chars!!';
      const key = crypto.scryptSync(secretKey, 'salt', 32);
      const parts = hashedData.split(':');
      if (parts.length !== 2) return null;
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      return null;
    }
  };

  const clientUrl=(tier)=>{
    if(tier=='dev'){
      return "http://localhost:5173"
    }
    return "https://clickly.cv/app"
  }


  const serverUrl=(tier)=>{
    if(tier==dev){
        return "http://localhost:8080"
    }
    return "https://clickly.cv"
}
  module.exports = { hashData, unhashData,clientUrl,serverUrl };