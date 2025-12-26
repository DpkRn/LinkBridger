export const serverUrl=(tier)=>{
    if(tier=='dev'){
        return "http://localhost:8080"
    }
    return "https://clickly.cv"
}

export const clientUrl=(tier)=>{
    if(tier=='dev'){
      return "http://localhost:5173"
    }
    return "https://clickly.cv/app"
  }
