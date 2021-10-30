
export const formatDate = (date: Date) => {
var d = new Date(date)
const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
    };
return d.toLocaleString('sv-SE', options);
}


export const vaccineSuppliers = [
    {value: "astra", label: "Astra Zenecca"},
    {value: "pfizer", label: "Pfizer"}
]