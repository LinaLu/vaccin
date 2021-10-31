import React, {useEffect, useState} from 'react';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import DataPicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Stack, Table} from "react-bootstrap";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useFetchWrapper} from "../utils/fetchWrapper";
import {formatDate} from "../utils/utilities";

const validationSchema = Yup.object().shape({
    quantityDose: Yup.number().typeError('heltal krävs').integer('heltal krävs').positive('kvantitet kan ej vara negativ').required('kvantitet saknas'),
    GLNCode: Yup.string().required('GLN kod saknas')
});

interface FormInput {
    orderDate: Date;
    requestDeliveryDate: Date;
    quantityDose: number;
    GLNCode: string;
}

interface Row extends Omit<FormInput, 'orderDate' | 'requestDeliveryDate'> {
    id: number;
    orderDate: string | null;
    requestDeliveryDate: string; 
}

export function OrderForm() {

    const {register, control, handleSubmit, reset, formState: { errors } } = useForm<FormInput>(
        {resolver: yupResolver(validationSchema)}
    );

    const [rows, setRows] = useState<Array<Row>>([]);
    const api = useFetchWrapper();

    const fetchData = async () => {
        try {
            const response = await api.get('/api/vaccine/supply/order')
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

    const onSubmit: SubmitHandler<FormInput> = async (data, e) => { 
        await api.post('/api/vaccine/supply/order', data)
        reset();
        await fetchData();
    }

    const onDelete = async (e: React.MouseEvent, id: number | undefined) => {
        e.preventDefault();
        await api.delete('/api/vaccine/supply/order/' + id)
        await fetchData();
    }

    return (
        <Stack gap={1}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Table bordered>
                    <thead>
                    <tr>
                        <th>
                            Beställningsdatum:
                        </th>
                        <th>
                            Önskat lev datum
                        </th>
                        <th>
                            kvantitet dos
                        </th>
                        <th>
                            GLN-mottagare
                        </th>
                        <th>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(row => (                        
                        <tr key={row.id}>
                            <td>{formatDate(row.orderDate)}</td>
                            <td>{formatDate(row.requestDeliveryDate)}</td>
                            <td>{row.quantityDose}</td>
                            <td>{row.GLNCode}</td>
                            <td>
                                <button onClick={(e) => onDelete(e, row.id)}>delete</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <Controller
                                name={"orderDate"}
                                control={control}
                                defaultValue={new Date()}
                                render={({field: {onChange, value}}) => (
                                    <DataPicker onChange={onChange}
                                                selected={value}
                                                placeholderText="Lev datum"
                                                dateFormat="yyyy-MM-dd"
                                    />)}
                            />
                        </td>
                        <td>
                            <Controller
                                name={"requestDeliveryDate"}
                                control={control}
                                defaultValue={new Date()}
                                render={({field: {onChange, value}}) =>
                                    <DataPicker onChange={onChange}
                                                selected={value}
                                                placeholderText="Planerat lev datum"
                                                dateFormat="yyyy-MM-dd"
                                    />}
                            />
                        </td>
                        <td>
                            <input
                                {...register('quantityDose')}
                                className={`form-control ${errors.quantityDose ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-quantityDose">{errors.quantityDose?.message}</div>
                        </td>
                        <td>
                            <input 
                                {...register('GLNCode')}
                                className={`form-control ${errors.GLNCode ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-GLNCode">{errors.GLNCode?.message}</div>
                        </td>
                        <td>
                            <button type="submit">Submit</button>                        
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </form>
        </Stack>

    );
}
