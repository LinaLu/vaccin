import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import DataPicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Stack, Table} from "react-bootstrap";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useFetchWrapper} from "../utils/fetchWrapper";
import {formatDate, vaccineSuppliers} from "../utils/utilities";

const validationSchema = Yup.object().shape({
    quantity: Yup.number().typeError('heltal krävs').integer('heltal krävs').positive('kvantitet kan ej vara negativ').required('kvantitet saknas'),
    GLNCode: Yup.string().required('GLN kod saknas'),
    vaccineSupplier: Yup.string().required('Välj leverantör')
});

interface Row extends Omit<FormInput, 'deliveryDate'|'plannedDeliveryDate'> {
    deliveryDate: string | null;
    plannedDeliveryDate: string;
}

interface FormInput {
    id?: number;
    deliveryDate: Date;
    plannedDeliveryDate: Date;
    vaccineSupplier: string;
    quantity: number;
    GLNCode: string;
}


export function IncomingDeliveryForm() {

    const {register, control, handleSubmit, reset, formState: { errors } } = useForm<FormInput>(
        {resolver: yupResolver(validationSchema)}
    );

    const [rows, setRows] = useState<Array<Row>>([]);
    const api = useFetchWrapper();

    const fetchData = async () => {
        try {
            const response = await api.get('/api/vaccine/supply/incoming_delivery')
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
        await api.post('/api/vaccine/supply/incoming_delivery', data)
        reset();
        await fetchData();
    }

    const onDelete = async (e: React.MouseEvent, id: number | undefined) => {
        e.preventDefault();
        await api.delete('/api/vaccine/supply/incoming_delivery/' + id)
        await fetchData();
    }

    return (
        <Stack gap={1}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Table bordered>
                    <thead>
                    <tr>
                        <th>
                            Lev datum:
                        </th>
                        <th>
                            Planerat lev datum
                        </th>
                        <th>
                            vaccinleverantör
                        </th>
                        <th>
                            kvantitet vial
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
                            <td>{formatDate(row.deliveryDate)}</td>
                            <td>{formatDate(row.plannedDeliveryDate)}</td>
                            <td>{row.vaccineSupplier}</td>
                            <td>{row.quantity}</td>
                            <td>{row.GLNCode}</td>
                            <td>
                                <button onClick={(e) => onDelete(e, row.id)}>delete</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <th scope="row">
                            <Controller
                                name={"deliveryDate"}
                                control={control}
                                defaultValue={new Date()}
                                render={({field: {onChange, value}}) => (
                                    <DataPicker onChange={onChange}
                                                selected={value}
                                                placeholderText="Lev datum"
                                                dateFormat="yyyy-MM-dd"
                                    />)}
                            />
                        </th>
                        <td>
                            <Controller
                                name={"plannedDeliveryDate"}
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
                            <Controller
                                name="vaccineSupplier"
                                control={control}
                                render={({field: {onChange, value}, fieldState: { error }}) =>
                                    <>
                                        <Select
                                        {...register("vaccineSupplier")}
                                        onChange={(e) => e && e.label? onChange(e.label) : onChange(undefined)}
                                        options={vaccineSuppliers}
                                        isClearable
                                        defaultValue={undefined}
                                        />

                                        {errors && errors.vaccineSupplier && (
                                        <div className="is-invalid">
                                            {errors.vaccineSupplier.message}
                                        </div>
                                        )}
                                   
                                    </>
                                }
                            />
                        </td>
                        <td>
                            <input
                                {...register('quantity')}
                                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-quantity">{errors.quantity?.message}</div>
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
