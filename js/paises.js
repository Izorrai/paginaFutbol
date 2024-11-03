

class Paises {
    async recibirPais() {
        const apiKey = "e9aa4ab99d4a7c62574ab66068fc12b118e5fe1ac1a425832c01591dd9b42879";
        const url = `https://apiv3.apifootball.com/?action=get_countries&APIkey=${apiKey}`;

        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error("HTTP ERROR");
            }
            return await respuesta.json(); 
        } catch (error) {
            console.log(error);
            return []; 
        }
    }
}

export default Paises;