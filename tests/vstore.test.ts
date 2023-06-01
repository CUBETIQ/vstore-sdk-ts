import { VStore } from '../src';

const PROJECT_ID = '6474a39cccfc632b1fc5e75a';
const API_KEY = 'sm_ALdbC1VOgtjEIoMRrfYKHBjsN9egY2m92'

const sdk = VStore.createWith(PROJECT_ID, API_KEY);

test('process.env should be defined', () => {
    // @ts-ignore
    expect(process.env).toBeDefined();
});

test('vstore sdk should be defined', () => {
    expect(sdk).toBeDefined();
});

test('vstore sdk should be ready', async () => {
    await sdk.config().waitForReady()
    expect(sdk.config().isReady()).toBeTruthy()
})

test('vstore sdk should be able to get the configs', async () => {
    const appName = sdk.config().getByKey('app.name')
    expect(appName).toBe('CUBETIQ POS')

    const serverKafkaDemo = sdk.config().getJSONByKey('server.kafka-demo')
    expect(serverKafkaDemo).toBeDefined()
    expect(serverKafkaDemo).toBeInstanceOf(Object)
    expect(serverKafkaDemo['bootstrap.servers']).toBe('localhost:9092')

    const appNameCommon = sdk.config().get('common', 'app.name')
    expect(appNameCommon).toBe('CUBETIQ POS')
})

test('vstore sdk unable to get the configs', async () => {
    const appName = sdk.config().getByKey('app.name.notfound')
    expect(appName).toBeUndefined()

    const serverKafkaDemo = sdk.config().getJSONByKey('server.kafka-demo.notfound')
    expect(serverKafkaDemo).toBeUndefined()

    const appNameCommon = sdk.config().get('common', 'app.name.notfound')
    expect(appNameCommon).toBeUndefined()
})

test('vstore sdk is refresh the configs', async () => {
    await sdk.config().refresh()
    expect(sdk.config().isReady()).toBeTruthy()
})

test('vstore sdk should be able to get the configs after refresh', async () => {
    const appName = sdk.config().getByKey('app.name')
    expect(appName).toBe('CUBETIQ POS')

    const serverKafkaDemo = sdk.config().getJSONByKey('server.kafka-demo')
    expect(serverKafkaDemo).toBeDefined()
    expect(serverKafkaDemo).toBeInstanceOf(Object)
    expect(serverKafkaDemo['bootstrap.servers']).toBe('localhost:9092')

    const appNameCommon = sdk.config().get('common', 'app.name')
    expect(appNameCommon).toBe('CUBETIQ POS')
})

test('vstore sdk should be able to load to envs (process.env)', async () => {
    await sdk.config().loadToEnv()
    
    // @ts-ignore
    expect(process.env['app.name']).toBe('CUBETIQ POS')
    // @ts-ignore
    expect(process.env['server.kafka-demo']).toBeDefined()
    // @ts-ignore
    expect(process.env['server.kafka-demo']).toBe('{\"bootstrap.servers\":\"localhost:9092\"}')
})