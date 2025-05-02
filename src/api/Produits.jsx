
const API_URL = "https://script.google.com/macros/s/AKfycbz9nzy5IilGeUoLPbEWs-_Lka8mjIAtuNW2N5IcD1nT3Dvbr2LQVK7Am-b6kEPhl6CzYQ/exec";


const handleAuthFailure = (message) => {
  if (message === "Votre compte non approved" || message === "Votre compte non existe") {
    localStorage.removeItem("user");
    window.location.href = "/login";

    return true;
  }
  return false;
};


export const login = async (formattedData,type) => {
  try {

      const response = await fetch(`${API_URL}?action=auth&type=${type}`, {
          method: "POST",
          body: JSON.stringify({ formattedData }),
      });

      return await response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;  
  }
};

export const loogout = async (formattedData,type) => {
  try {

      const response = await fetch(`${API_URL}?type=${type}`, {
          method: "POST",
          body: JSON.stringify({ formattedData }),
      });

      return await response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;  
  }
};


export const getData = async (type,usernameId) => {
    try {
      const response = await fetch(`${API_URL}?type=${type}&usernameId=${usernameId}`, { method: "GET" });  
      if (response.ok) {
        const data = await response.json();
        if (handleAuthFailure(data.message)) return;

        return data;
      } else {
        throw new Error('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;  
    }
  };

export const update = async (formattedData,type,usernameId) => {
    try {
        const response = await fetch(`${API_URL}?action=update&type=${type}&usernameId=${usernameId}`, {
            method: "POST",
            body: JSON.stringify({ formattedData }),
        });

        const data = await response.json();

        if (handleAuthFailure(data.message)) return;
    
        return data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        throw error;
    }
};

export const add = async (formattedData,type,usernameId) => {
  try {

    console.log("formattedData",formattedData);
    console.log("type",type);
    console.log("usernameId",usernameId);
      const response = await fetch(`${API_URL}?action=add&type=${type}&usernameId=${usernameId}`, {
          method: "POST",
          body: JSON.stringify({ formattedData }),
      });

      const data = await response.json();
      console.log(data);

      if (handleAuthFailure(data.message)) return;
  
      return data;
      } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      throw error;
  }
};

export const excelImport = async (formattedData,type,usernameId) => {
  try {

    console.log("formattedData",formattedData);
    console.log("type",type);
    console.log("usernameId",usernameId);
      const response = await fetch(`${API_URL}?action=excel&type=${type}&usernameId=${usernameId}`, {
          method: "POST",
          body: JSON.stringify({ formattedData }),
      });

      const data = await response.json();
      console.log(data);

      if (handleAuthFailure(data.message)) return;
  
      return data;
      } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      throw error;
  }
};

export const deletee = async (formattedData,type,usernameId) => {
  try {

      const response = await fetch(`${API_URL}?action=delete&type=${type}&usernameId=${usernameId}`, {
          method: "POST",
          body: JSON.stringify({ formattedData }),
      });

      const data = await response.json();

      if (handleAuthFailure(data.message)) return;
  
      return data;
      } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      throw error;
  }
};

