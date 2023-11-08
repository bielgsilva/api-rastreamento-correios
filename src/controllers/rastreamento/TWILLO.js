const accountSid = 'AC3a186cc082bb550c698ecb20c4eb4d36';
const authToken = '9d5c0f080c46abd61a1a9c7e757699f8';
const client = require('twilio')(accountSid, authToken);

const correios = require('correios-rastreamento');



const rastrearEncomenda = async (request, response) => {
    try {
        const { tracking } = request.query;


        const result = await correios.sroV2.rastrearObjeto(tracking);

        const formattedResult = formatResult(result);

        function formatResult(result) {
            const statusList = result.status_list.map(item => {
                const { status, data, local, origem, destino } = item;

                let formattedStatus = `✉️ Status: ${status}`;
                let formattedData = `📅 Data: ${new Date(data).toLocaleDateString()}`;
                let formattedLocal = `🏢 Local: ${local || 'N/A'}`;
                let formattedOrigem = origem ? `🛫 Origem: ${origem}` : '';
                let formattedDestino = destino ? `🛬 Destino: ${destino}` : '';

                return `${formattedStatus}\n${formattedData}\n${formattedLocal}\n${formattedOrigem}\n${formattedDestino}\n`;
            });

            return `ℹ️ Atualização de Status da Encomenda:\n\n${statusList.join('\n\n')}`;
        }

        client.messages
            .create({
                body: formattedResult,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+557192756652'
            })
            .then(message => console.log(message.sid))

        return response
            .status(200)
            .json({ result });

    } catch (error) {
        console.log(error);

        return response
            .status(500)
            .json({ message: "Error", error: error.message });
    }
};


module.exports = { rastrearEncomenda };
