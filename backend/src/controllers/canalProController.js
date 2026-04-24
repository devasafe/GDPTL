import Imovel from '../models/Imovel.js';

const TIPO_MAP = {
  apartamento: 'Residential/Apartment',
  casa: 'Residential/Home',
  terreno: 'Residential/Lot',
  comercial: 'Commercial/Offices',
  sala: 'Commercial/Offices',
  galpao: 'Commercial/Warehouse',
  fazenda: 'Rural/Farm',
  chacara: 'Rural/Farm',
};

function mapTipo(tipo = '') {
  return TIPO_MAP[tipo.toLowerCase()] || 'Residential/Home';
}

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function gerarListingXML(imovel) {
  const propertyType = mapTipo(imovel.tipo);
  const fotos = (imovel.midias || []).filter((m) => m.tipo === 'foto');

  const mediaXML = fotos
    .map(
      (m, idx) =>
        `      <Media medium="image" url="${esc(m.url)}" position="${idx + 1}"/>`
    )
    .join('\n');

  const locationXML = `
      <Address>${esc(imovel.localizacao?.endereco || '')}</Address>
      <City>${esc(imovel.cidade)}</City>
      <Neighborhood>${esc(imovel.bairro)}</Neighborhood>
      <State>SP</State>
      <Country>Brasil</Country>
      ${imovel.localizacao?.lat ? `<Latitude>${imovel.localizacao.lat}</Latitude>` : ''}
      ${imovel.localizacao?.lng ? `<Longitude>${imovel.localizacao.lng}</Longitude>` : ''}`;

  return `  <Listing>
    <ListingID>${esc(imovel._id)}</ListingID>
    <Title>${esc(imovel.titulo)}</Title>
    <TransactionType>For Sale</TransactionType>
    <PublicationType>PUBLIC</PublicationType>
    <Details>
      <PropertyType>${propertyType}</PropertyType>
      <UsageType>Residential</UsageType>
      <Description>${esc((imovel.descricao || '').slice(0, 3000))}</Description>
      <ListPrice currency="BRL">${imovel.preco}</ListPrice>
      ${imovel.area ? `<LivingArea unit="square metres">${imovel.area}</LivingArea>` : ''}
      ${imovel.quartos != null ? `<Bedrooms>${imovel.quartos}</Bedrooms>` : ''}
      ${imovel.banheiros != null ? `<Bathrooms>${imovel.banheiros}</Bathrooms>` : ''}
      ${imovel.suites != null ? `<Suites>${imovel.suites}</Suites>` : ''}
      ${imovel.vagas != null ? `<Garage>${imovel.vagas}</Garage>` : ''}
    </Details>
    <Location>${locationXML}
    </Location>
    <Media>${mediaXML ? '\n' + mediaXML + '\n    ' : ''}</Media>
  </Listing>`;
}

export const gerarFeedXML = async (req, res, next) => {
  try {
    const imoveis = await Imovel.find({ canalPro: true, status: 'ativo' });

    const now = new Date().toISOString();
    const listings = imoveis.map(gerarListingXML).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns="http://www.vrsync.com/schema/2.0/listingdata.xsd">
  <Header>
    <Provider>Guedes Capital Imobiliária</Provider>
    <PublishDate>${now}</PublishDate>
  </Header>
  <Listings>
${listings}
  </Listings>
</ListingDataFeed>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    next(err);
  }
};
