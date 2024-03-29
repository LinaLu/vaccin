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
    quantityVial: Yup.number().typeError('heltal krävs').integer('heltal krävs').positive('kvantitet kan ej vara negativ').required('kvantitet saknas'),
    quantityDose: Yup.number().typeError('heltal krävs').integer('heltal krävs').positive('kvantitet kan ej vara negativ').required('kvantitet saknas'),
    vaccineSupplier: Yup.string().required('Välj leverantör')
});

interface Row extends Omit<FormInput, 'deliveryDate'> {
    id?: number;
    account?: string;
    deliveryDate: string;
}

interface FormInput {
    deliveryDate: Date;
    vaccineSupplier: string;
    quantityVial: number;
    quantityDose: number;
}

interface InventoryFormProps {
    isAdmin: boolean;
}

export function InventoryForm({isAdmin}: InventoryFormProps) {

    const {register, control, handleSubmit, reset, formState: { errors } } = useForm<FormInput>(
        {resolver: yupResolver(validationSchema)}
    );

    const [rows, setRows] = useState<Array<Row>>([]);
    const api = useFetchWrapper();
 
    const fetchData = async () => {
        try {
            const response = await api.get('/api/vaccine/supply/inventory')
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
        await api.post('/api/vaccine/supply/inventory', data)
        reset();
        await fetchData();
    }

    const onDelete = async (e: React.MouseEvent, id: number | undefined) => {
        e.preventDefault();
        await api.delete('/api/vaccine/supply/inventory/' + id)
        await fetchData();
    }

    return (
        <Stack gap={1}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Table bordered>
                    <thead>
                    <tr>
                        { isAdmin &&
                        <th>
                            Vårdgivare
                        </th> }
                        <th>
                            Datum tid:
                        </th>
                        <th>
                            vaccinleverantör
                        </th>
                        <th>
                            kvantitet vial
                        </th>
                        <th>
                            kvantitet dos
                        </th>
                        <th>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(row => (
                        <tr key={row.id}>
                            { isAdmin && <td>{row.account}</td> }
                            <td>{formatDate(row.deliveryDate)}</td>
                            <td>{row.vaccineSupplier}</td>
                            <td>{row.quantityVial}</td>
                            <td>{row.quantityDose}</td>
                            <td>
                                <button onClick={(e) => onDelete(e, row.id)}>delete</button>
                            </td>
                        </tr>
                    ))}
                    {!isAdmin &&
                    <tr>
                        <th scope="row">
                            <Controller
                                name={"deliveryDate"}
                                control={control}
                                defaultValue={new Date()}
                                render={({field: {onChange, value}}) => (
                                    <DataPicker onChange={onChange}
                                                selected={value}
                                                placeholderText="Datum tid"
                                                dateFormat="yyyy-MM-dd"
                                    />)}
                            />
                        </th>

                        <td>
                            <Controller
                                name="vaccineSupplier"
                                control={control}
                                render={({field: {onChange, value}, fieldState: {error}}) =>
                                    <>
                                        <Select
                                            {...register("vaccineSupplier")}
                                            onChange={(e) => e && e.label ? onChange(e.label) : onChange(undefined)}
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
                                {...register('quantityVial')}
                                className={`form-control ${errors.quantityVial ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-quantityVial">{errors.quantityVial?.message}</div>
                        </td>
                        <td>
                            <input
                                {...register('quantityDose')}
                                className={`form-control ${errors.quantityDose ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-quantityDose">{errors.quantityDose?.message}</div>
                        </td>
                        <td>
                            <button type="submit">Submit</button>
                        </td>
                    </tr>
                    }
                    </tbody>
                </Table>
            </form>
        </Stack>

    );
}
