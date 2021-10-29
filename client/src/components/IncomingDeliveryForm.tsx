import React from 'react';
import Select from "react-select";
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import DataPicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface FormInput {
    deliveryDate: Date;
    plannedDeliveryDate: Date;
    vaccineSupplier: string;
    quantity: number;
    GLNCode: string;
}

const vaccineSuppliers = [
    { value: "astra", label: "Astra Zenecca" },
    { value: "pfizer", label: "Pfizer" }
]

export function IncomingDeliveryForm() {
    const {register, control, handleSubmit} = useForm<FormInput>();
    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        const response = await fetch('/api/vaccine/supply/incoming_delivery', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        console.log(response)
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name={"deliveryDate"}
                    control={control}
                    defaultValue={new Date()}
                    render={({field: {onChange, value}}) => (
                        <DataPicker onChange={onChange}
                                    selected={value}
                                    placeholderText="Lev datum"
                        />)}
                />
                <Controller
                    name={"plannedDeliveryDate"}
                    control={control}
                    defaultValue={new Date()}
                    render={({field: {onChange, value}}) =>
                        <DataPicker onChange={onChange}
                                    selected={value}
                                    placeholderText="Planerat lev datum"
                        />}
                />
                <Controller
                    name="vaccineSupplier"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <Select
                            onChange={onChange}
                            defaultValue={vaccineSuppliers[1]}
                            options={vaccineSuppliers}
                        />}
                />
                <input {...register('quantity')}/>
                <input {...register('GLNCode')}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
