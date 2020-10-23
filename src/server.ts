import { service } from "./index";
import { SERVICE_PORT } from "./constants";

service.listen(parseInt(SERVICE_PORT.toString()), () => {
    console.info(`Service listening on localhost:${SERVICE_PORT}`);
});
