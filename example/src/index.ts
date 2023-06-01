import { VStore } from "@cubetiq/vstore";


const PROJECT_ID = '6474a39cccfc632b1fc5e75a';
const API_KEY = 'sm_ALdbC1VOgtjEIoMRrfYKHBjsN9egY2m92'

const sdk = VStore.createWith(PROJECT_ID, API_KEY);

sdk.config().waitForReady().then(() => {
    console.log(sdk.config().isReady())
    console.log(sdk.config().getByKey('app.name'))
    console.log(sdk.config().getJSONByKey('server.kafka-demo'))
    console.log(sdk.config().get('common', 'app.name'))
}).catch((err) => {
    console.error(err);
})