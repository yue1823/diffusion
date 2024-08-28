import React, {useEffect} from 'react';
import "../css_folder/heardbar.css"
import {Badge, Card} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {TeamOutlined} from "@ant-design/icons";
import diffusion_logo from "../art/diffusion7.png"
import "../css_folder/resources_address_box.css"





const Resource_address_box:React.FC<{ address:string}> = ({ address}) =>  {

    useEffect(() => {

    },[address]);
    return (
        <div>

                <Badge.Ribbon text="Diffusion" color="red">
                    <Card title={<><TeamOutlined /> Diffusion</>} size="small" style={{width:180}}>
                        <div className={""}>
                            <img src={diffusion_logo} alt={"diffusion logo"} className={"diffusion_logo_resource_address_box"}></img>
                        </div>
                    </Card>
                </Badge.Ribbon>

        </div>
    );
}

export default Resource_address_box