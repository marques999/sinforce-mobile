angular.module('sinforce.constants', []).constant('ApiConfiguration', {
  url: 'http://188.83.2.109',
  port: '49822',
  endpoint: 'http://188.83.2.109:49822'
}).constant('listaPaises', {
  AN: 'Angola',
  AT: 'Austria',
  BE: 'Bélgica',
  BR: 'Brasil',
  DE: 'Alemanha',
  DK: 'Dinamarca',
  ES: 'Espanha',
  FI: 'Finlândia',
  FR: 'França',
  GB: 'Inglaterra',
  GR: 'Grécia',
  IE: 'Irlanda',
  IT: 'Itália',
  LU: 'Luxemburgo',
  NL: 'Holanda',
  PT: 'Portugal',
  SE: 'Suécia',
  US: 'E. Unidos da América'
}).constant('AgendaConstants', {
  tipos: {
    APRES: 'Apresentação de proposta',
    COB: 'Cobrança',
    COMP: 'Compromisso',
    CARTA: 'Envio de carta',
    EMAIL: 'Envio de e-mail',
    PROP: 'Envio de proposta',
    REUN: 'Reunião',
    TAR: 'Tarefa',
    TEL: 'Telefonema'
  },
  glyphIcons: {
    TEL: 'fa-phone',
    COMP: 'fa-handshake-o',
    REUN: 'fa-users',
    EMAIL: 'fa-envelope',
    COB: 'fa-usd',
    TAR: 'fa-gears',
    PROP: 'fa-briefcase',
    APRES: 'fa-line-chart'
  },
  origens: {
    N: 'Nenhuma',
    X: 'Contacto',
    C: 'Cliente',
    L: 'Lead'
  },
  prioridades: [
    'Baixa',
    'Normal',
    'Alta',
    'Urgente'
  ]
}).constant('OpportunitiesConstants', {
  zona: [{
    id: 1,
    descricao: 'Zona Norte'
  }, {
    id: 2,
    descricao: 'Zona Centro'
  }, {
    id: 3,
    descricao: 'Zona Sul'
  }, {
    id: 4,
    descricao: 'Madeira'
  }, {
    id: 5,
    descricao: 'Açores'
  }, {
    id: 6,
    descricao: 'Grande Porto'
  }, {
    id: 7,
    descricao: 'Grande Lisboa'
  }, {
    id: 20,
    descricao: 'Comunidade Europeia'
  }, {
    id: 30,
    descricao: 'Estados Unidos'
  }, {
    id: 31,
    descricao: 'Angola'
  }],
  sellsCycle: [{
    ciclo: 'CV_HW',
    descricao: 'Venda de Hardware1'
  }, {
    ciclo: 'CV_SOFT',
    descricao: 'Venda de Software'
  }],
  origem: [{
    origem: 'ANUN',
    descricao: 'Anúncio'
  }, {
    origem: 'EMAIL',
    descricao: 'Email'
  }, {
    origem: 'FAX',
    descricao: 'Fax'
  }, {
    origem: 'REF',
    descricao: 'Por Referência'
  }, {
    origem: 'TEL',
    descricao: 'Telefone'
  }, {
    origem: 'WEB',
    descricao: 'Internet'
  }],
  entity: [{
    id: 'N',
    descricao: 'Nenhuma'
  }, {
    id: 'X',
    descricao: 'Contacto'
  }, {
    id: 'C',
    descricao: 'Cliente'
  }, {
    id: 'L',
    descricao: 'Lead'
  }],
  state: [{
    id: 0,
    descricao: 'Aberta'
  }, {
    id: 1,
    descricao: 'Ganha'
  }, {
    id: 2,
    descricao: 'Perdida'
  }],
  paymentMethod: [{
    id: 'LAPL',
    description: 'Liquidação de Aplicação Financeira'
  }, {
    id: 'MB',
    description: 'Rec. por Multibanco'
  }, {
    id: 'NUM',
    description: 'Rec. em Numerário'
  }, {
    id: 'PAGCR',
    description: 'Pagamento de Cartão de Crédito'
  }, {
    id: 'PGNUM',
    description: 'Pagamento em Numerário'
  }, {
    id: 'SLA',
    description: 'Saldo abertura'
  }, {
    id: 'TCH',
    description: 'Transferência de Cheques'
  }, {
    id: 'TDEP',
    description: 'Talão de Depósito'
  }, {
    id: 'TRA',
    description: 'Transferência eletrónica'
  }, {
    id: 'TRF',
    description: 'Transferência bancária'
  }],
  paymentConditions: [{
    id: '1',
    days: 0,
    description: 'Pronto Pagamento'
  }, {
    id: '2',
    days: 30,
    description: 'Fatura a 30 dias'
  }, {
    id: '3',
    days: 45,
    description: 'Fatura a 45 dias'
  }, {
    id: '4',
    days: 60,
    description: 'Fatura a 60 dias'
  }, {
    id: '5',
    days: 0,
    description: 'Fim do Mês'
  }, {
    id: '6',
    days: 30,
    description: 'Próximo dia 30'
  }, {
    id: '7',
    days: 0,
    description: 'Próximo Mês, dia 31'
  }, {
    id: '8',
    days: 0,
    description: 'Prestações'
  }]
});