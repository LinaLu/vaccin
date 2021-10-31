
export const formatDate = (date: string | null) => {
if (date === null){
    return null
} else {
    var d = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
    };
    return d.toLocaleString('sv-SE', options);
}

}


export const vaccineSuppliers = [
    {value: "astra", label: "Astra Zenecca"},
    {value: "pfizer", label: "Pfizer"}
]