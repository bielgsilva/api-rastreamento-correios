const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const correios = require('correios-rastreamento');


const rastrearEncomenda = async (request, response) => {
    try {
        const { tracking } = request.query;
        const result = await correios.sroV2.rastrearObjeto(tracking);

        return response.status(200).json({ result });

    } catch (error) {
        return response.status(500).json({ message: "Error", error: error.message });
    }
};

const receberAtualizações = async (request, response) => {
    try {
        const { data, phoneNumber } = request.query;

        const formattedResult = formatResult(JSON.parse(data));

        const formattedNumber = phoneNumber.replace(/\D/g, '')

        console.log(formattedNumber);

        function formatResult(data) {
            const statusList = data.map(item => {
                const { status, data, local, origem, destino } = item;

                let formattedData = `📅 Data: ${new Date(data).toLocaleDateString()}`;
                let formattedStatus = `✉️ Status: ${status}`;
                let formattedLocal = `🏢 Local: ${local || 'N/A'}`;
                let formattedOrigem = origem ? `🛫 Origem: ${origem}` : '';
                let formattedDestino = destino ? `🛬 Destino: ${destino}` : '';

                return `${formattedData}\n${formattedStatus}\n${formattedLocal}\n${formattedOrigem}\n${formattedDestino}\n`;
            });


            return `ℹ️ Atualização de Status da Encomenda: \n\n\n${statusList.join('\n\n')}`;
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
            .json({ message: 'Atuazizações enviadas com sucesso!' });

    } catch (error) {
        console.log(error);

        return response
            .status(500)
            .json({ message: "Error", error: error.message });
    }
};


module.exports = { rastrearEncomenda, receberAtualizações };
