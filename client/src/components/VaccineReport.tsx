import React, {useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {Stack, Table} from "react-bootstrap";
import {useFetchWrapper} from "../utils/fetchWrapper";


interface ReportRow {
    account: string
    type: string; 
    date: string;
    count: number;
}


export function VaccineReport() {

    const [rows, setRows] = useState<Array<ReportRow>>([]);
    const api = useFetchWrapper();

    const fetchData = async () => {
        try {
            const response = await api.get('/api/vaccine/report')
                .catch(error => alert(error));
            setRows(response)
        } catch (error) {
            console.error("error", error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Stack gap={1}>            
                <Table bordered>
                    <thead>
                    <tr>
                        <th>
                            Vårdgivare
                        </th>
                        <th>
                            Datum
                        </th>
                        <th>
                            Uppgift
                        </th>
                        <th>
                            #
                        </th>                        
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(row => (
                        <tr key={row.account}>
                            <td>{row.account}</td>
                            <td>{row.date}</td>
                            <td>{row.type}</td>
                            <td>{row.count}</td>                                             
                        </tr>
                    ))}
                    </tbody>
                </Table>           
        </Stack>

    );
}
