const axios = require('axios');

const chave = 'ef0b0973b783e0614ac87612ec04344b';
const geocoding = 'https://api.openweathermap.org/geo/1.0/direct';
const weatherCurrent = 'https://api.openweathermap.org/data/2.5/weather';

async function obterCoordenadasCidade(nomeCidade) {
  try {
    const response = await axios.get(`${geocoding}?q=${nomeCidade}&appid=${chave}`);

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      console.log(`Coordenadas de ${nomeCidade}: Latitude ${lat}, Longitude ${lon}`);

      const previsaoTempo = await obterPrevisaoTempo(lat, lon);

      return { ...previsaoTempo, lat, lon };
    } else {
      throw new Error(`Não foi possível localizar as coordenadas para a cidade: ${nomeCidade}`);
    }
  } catch (error) {
    console.error(`Falha ao buscar as informações: ${error.message}`);
    throw error;
  }
}

async function obterPrevisaoTempo(latitude, longitude) {
  try {
    const response = await axios.get(`${weatherCurrent}?lat=${latitude}&lon=${longitude}&appid=${chave}&units=metric&lang=pt`);

    if (response.data.main && response.data.weather) {
      const { feels_like } = response.data.main;
      const description = response.data.weather[0].description;

      console.log(`Sensação térmica: ${feels_like.toFixed(1)}°C`);
      console.log(`Descrição do clima: ${description}`);

      // Retorna um objeto contendo as informações
      return { feels_like, description };
    } else {
      console.log('Previsão de tempo não encontrada.');
      return {};
    }
  } catch (error) {
    console.error(`Erro ao obter previsão do tempo: ${error.message}`);
    throw error;
  }
}

async function main() {
  const nomeCidade = '';
  try {
    // Chama a função para obter todas as informações
    const informacoes = await obterCoordenadasCidade(nomeCidade);
    console.log('Informações:', informacoes);
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Chama a função principal
main();
