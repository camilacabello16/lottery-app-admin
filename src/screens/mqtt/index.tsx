import React, { useEffect, useState } from 'react';
import mqtt from 'precompiled-mqtt';
import { View, Text } from 'react-native';
import { Button } from 'react-native';
import { makeid } from '../../utils/common';

const MQTTExample = () => {
    const [client, setClient] = useState<mqtt.MqttClient | null>(null); // Initialize as null

    useEffect(() => {
        const brokerUrl = 'ws://socket-client.veso3mien.vn:8083';
        const options = {
            // host: 'ws://socket-client.veso3mien.vn',
            // port: 8083,
            clientId: 'APPNV_1000000',
            username: 'emqx-client',
            password: 'qtBtvrdmRKaAha2GcnaUkGf3Fu84TJF8',
            path: '/mqtt'
        };
        const mqttClient = mqtt.connect(brokerUrl, options);

        mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker 123');
            mqttClient.subscribe('oder_done');
        });

        mqttClient.on('message', (topic, message) => {
            console.log(topic);

            console.log(`Received message on topic ${topic}: ${message.toString()}`);
        });

        mqttClient.on('error', (error) => {
            console.error('MQTT Error:', error);
        });

        setClient(mqttClient); // Set the client instance

        return () => {
            mqttClient.end();
        };
    }, []);

    const sendMessage = () => {
        if (client) {
            const topic = 'test';
            const message = 'Hello, MQTT!';
            client.publish(topic, message);
            console.log("message");

        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>MQTT Example</Text>
            <Button title="Send Message" onPress={sendMessage} />
        </View>
    );
};

export default MQTTExample;