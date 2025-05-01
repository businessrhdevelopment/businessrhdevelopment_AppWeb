const API_URL = "https://script.google.com/macros/s/AKfycbz9nzy5IilGeUoLPbEWs-_Lka8mjIAtuNW2N5IcD1nT3Dvbr2LQVK7Am-b6kEPhl6CzYQ/exec";




export const login = async (formattedData,type) => {
  try {
    console.log("formattedData",formattedData)
    console.log("type",type)
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
    console.log("formattedData",formattedData)
    console.log("type",type)
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

export const getData = async (type) => {
    try {
      const response = await fetch(`${API_URL}?type=${type}`, { method: "GET" });  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;  
    }
  };

export const update = async (formattedData,type) => {
    try {
        const response = await fetch(`${API_URL}?action=update&type=${type}`, {
            method: "POST",
            body: JSON.stringify({ formattedData }),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        throw error;
    }
};

export const add = async (formattedData,type) => {
  try {
      const response = await fetch(`${API_URL}?action=add&type=${type}`, {
          method: "POST",
          body: JSON.stringify({ formattedData }),
      });

      return await response.json();
  } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      throw error;
  }
};
export const deletee = async (formattedData,type) => {
  try {
      const response = await fetch(`${API_URL}?action=delete&type=${type}`, {
          method: "POST",
          body: JSON.stringify({ formattedData }),
      });

      return await response.json();
  } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      throw error;
  }
};

