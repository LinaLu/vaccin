import {Tab, Tabs} from "react-bootstrap";
import {IncomingDeliveryForm} from "../components/IncomingDeliveryForm";
import { InventoryForm } from "../components/InventoryForm";
import { ConsumptionForm } from "../components/ConsumptionForm";
import { CapacityForm } from "../components/CapacityForm";
import { OrderForm } from "../components/OrderForm";
import { VaccineReport } from "../components/VaccineReport";

interface VaccineDeliveryProps {
    isAdmin: boolean;
}

export default function VaccineDelivery({isAdmin}: VaccineDeliveryProps) {
    return (        
        <Tabs defaultActiveKey="delivery" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="delivery" title="Inleverans">
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
            <Tab eventKey="admin" title="Admin" disabled={!isAdmin}>
                {isAdmin && <VaccineReport/>}
            </Tab>
        </Tabs>
    );
}


