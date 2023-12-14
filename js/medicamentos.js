fetch('https://api-salta-de-turno.onrender.com/api/medicamentos')
        .then(response =>{
            if(!response.ok){
                throw new Error("HTTP error" + response.status);
            }
            return response.json();
        })
        .then(data =>{
            console.log(data);
        })
        .catch(error =>{
            console.error(error);
        })
        