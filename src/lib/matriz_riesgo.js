matrizRiesgo = (prob, imp)=> {
    const probabilidades = ["Muy Baja","Baja","Media","Alta","Muy Alta"];
    const impactos = ["Insignificante","Leve","Medio","Severo","Muy Severo"];
    const matriz = [{probabilidad: probabilidades[0],impacto: impactos[0],resultado:"Bajo"},
                    {probabilidad: probabilidades[0],impacto: impactos[1],resultado:"Bajo"},
                    {probabilidad: probabilidades[0],impacto: impactos[2],resultado:"Bajo"},
                    {probabilidad: probabilidades[0],impacto: impactos[3],resultado:"Bajo"},
                    {probabilidad: probabilidades[0],impacto: impactos[4],resultado:"Moderado"},
                    {probabilidad: probabilidades[1],impacto: impactos[0],resultado:"Bajo"},
                    {probabilidad: probabilidades[1],impacto: impactos[1],resultado:"Bajo"},
                    {probabilidad: probabilidades[1],impacto: impactos[2],resultado:"Moderado"},
                    {probabilidad: probabilidades[1],impacto: impactos[3],resultado:"Moderado"},
                    {probabilidad: probabilidades[1],impacto: impactos[4],resultado:"Alto"},
                    {probabilidad: probabilidades[2],impacto: impactos[0],resultado:"Bajo"},
                    {probabilidad: probabilidades[2],impacto: impactos[1],resultado:"Moderado"},
                    {probabilidad: probabilidades[2],impacto: impactos[2],resultado:"Moderado"},
                    {probabilidad: probabilidades[2],impacto: impactos[3],resultado:"Moderado"},
                    {probabilidad: probabilidades[2],impacto: impactos[4],resultado:"Alto"},
                    {probabilidad: probabilidades[3],impacto: impactos[0],resultado:"Bajo"},
                    {probabilidad: probabilidades[3],impacto: impactos[1],resultado:"Moderado"},
                    {probabilidad: probabilidades[3],impacto: impactos[2],resultado:"Moderado"},
                    {probabilidad: probabilidades[3],impacto: impactos[3],resultado:"Alto"},
                    {probabilidad: probabilidades[3],impacto: impactos[4],resultado:"Muy Alto"},
                    {probabilidad: probabilidades[4],impacto: impactos[0],resultado:"Moderado"},
                    {probabilidad: probabilidades[4],impacto: impactos[1],resultado:"Alto"},
                    {probabilidad: probabilidades[4],impacto: impactos[2],resultado:"Alto"},
                    {probabilidad: probabilidades[4],impacto: impactos[3],resultado:"Muy Alto"},
                    {probabilidad: probabilidades[4],impacto: impactos[4],resultado:"Muy Alto"},
                ];
    let result = "No definido";
    matriz.forEach(caso => {
        if (prob == caso.probabilidad && imp == caso.impacto){
            result = caso.resultado;
        };   
    });
    return(result);
};
module.exports = matrizRiesgo;