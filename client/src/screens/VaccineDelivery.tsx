import {Tab, Tabs} from "react-bootstrap";
import {IncomingDeliveryForm} from "../components/IncomingDeliveryForm";
import React from "react";
import { InventoryForm } from "../components/InventoryForm";
import { ConsumptionForm } from "../components/ConsumptionForm";
import { CapacityForm } from "../components/CapacityForm";
import { OrderForm } from "../components/OrderForm";

export default function VaccineDelivery() {
    return (
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="delivery" title="InLeverans">
                <IncomingDeliveryForm/>
            </Tab>
            <Tab eventKey="saldo" title="Lagersaldo">
                <InventoryForm/>
            </Tab>
            <Tab eventKey="consumption" title="Förbrukning">
                <ConsumptionForm/>
            </Tab>
            <Tab eventKey="capacity" title="Kapacitet">
                <CapacityForm/>
            </Tab>
            <Tab eventKey="order" title="Beställning">
                 <OrderForm/>
            </Tab>
            <Tab eventKey="admin" title="Admin">
                    <ConsumptionForm/>
            </Tab>
        </Tabs>
    );
}


