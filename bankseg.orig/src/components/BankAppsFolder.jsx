import React, { useState, useEffect } from 'react';

// Lista de bancos populares com pacotes Android (Package Names) e esquemas de abertura
const BANCOS_DISPONIVEIS = [
  { id: 'nubank', nome: 'Nubank', cor: '#820AD1', icone: '🟣', scheme: 'nubank://', package: 'com.nu.production' },
  { id: 'itau', nome: 'Itaú', cor: '#EC7000', icone: '🟧', scheme: 'itau://', package: 'com.itau' },
  { id: 'bradesco', nome: 'Bradesco', cor: '#CC092F', icone: '🔴', scheme: 'bradesco://', package: 'com.bradesco' },
  { id: 'inter', nome: 'Banco Inter', cor: '#FF7A00', icone: '🟠', scheme: 'inter://', package: 'br.com.intermedium' },
  { id: 'santander', nome: 'Santander', cor: '#E60000', icone: '🔺', scheme: 'santander://', package: 'com.santander.app' },
  { id: 'caixa', nome: 'Caixa', cor: '#005CA9', icone: '🟦', scheme: 'caixa://', package: 'br.com.gabba.Caixa' },
  { id: 'bb', nome: 'Banco do Brasil', cor: '#FDF100', icone: '🟡', scheme: 'bb://', package: 'br.com.bb.android' },
  { id: 'c6', nome: 'C6 Bank', cor: '#1A1A1A', icone: '⚫', scheme: 'c6bank://', package: 'com.c6bank.app' },
  { id: 'mercadopago', nome: 'Mercado Pago', cor: '#009EE3', icone: '💠', scheme: 'mercadopago://', package: 'com.mercadopago.wallet' }
];

export default function BankAppsFolder({ isEmergencyMode, onLogout }) {
  const [bancosSelecionados, setBancosSelecionados] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const salvos = localStorage.getItem('pastaSegura_bancos');
    if (salvos) {
      setBancosSelecionados(JSON.parse(salvos));
    } else {
      // Padrão inicial: Nubank e Itaú
      const padrao = [BANCOS_DISPONIVEIS[0], BANCOS_DISPONIVEIS[1]];
      setBancosSelecionados(padrao);
      localStorage.setItem('pastaSegura_bancos', JSON.stringify(padrao));
    }
  }, []);

  const salvarBancos = (lista) => {
    setBancosSelecionados(lista);
    localStorage.setItem('pastaSegura_bancos', JSON.stringify(lista));
  };

  const alternarBanco = (banco) => {
    const jaExiste = bancosSelecionados.some(b => b.id === banco.id);
    if (jaExiste) {
      salvarBancos(bancosSelecionados.filter(b => b.id !== banco.id));
    } else {
      salvarBancos([...bancosSelecionados, banco]);
    }
  };

  const abrirBanco = (banco) => {
    // 1. Tenta abrir diretamente pelo protocolo nativo ou intent do Android
    const intentUrl = `intent://#Intent;package=${banco.package};scheme=${banco.id};end;`;
    
    // Tenta disparar o aplicativo nativo
    window.location.href = intentUrl;

    // Fallback caso o app não esteja instalado (abre a Play Store)
    setTimeout(() => {
      window.open(`https://play.google.com/store/apps/details?id=${banco.package}`, '_blank');
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Pasta Bancária</h2>
            <p style={styles.subtitle}>
              {isEmergencyMode ? 'Modo de Emergência Ativo' : 'Seus Aplicativos Protegidos'}
            </p>
          </div>
          <button onClick={() => setModalAberto(true)} style={styles.addBtn} title="Configurar bancos">
            ⚙️ Gerenciar
          </button>
        </div>

        {isEmergencyMode && (
          <div style={styles.alertBanner}>
            ⚠️ Modo Coação ativo: saldo protegido e alerta silencioso acionado.
          </div>
        )}

        <div style={styles.grid}>
          {bancosSelecionados.map((banco) => (
            <div 
              key={banco.id} 
              onClick={() => abrirBanco(banco)}
              style={styles.appIcon}
            >
              <div style={{ ...styles.iconBox, backgroundColor: banco.cor }}>
                <span style={{ fontSize: '24px' }}>{banco.icone}</span>
              </div>
              <span style={styles.appName}>{banco.nome}</span>
            </div>
          ))}

          <div onClick={() => setModalAberto(true)} style={styles.appIcon}>
            <div style={{ ...styles.iconBox, border: '2px dashed #94a3b8', backgroundColor: 'transparent' }}>
              <span style={{ fontSize: '24px', color: '#94a3b8' }}>+</span>
            </div>
            <span style={styles.appName}>Adicionar</span>
          </div>
        </div>

        <button onClick={onLogout} style={styles.logoutBtn}>
          Bloquear Pasta
        </button>
      </div>

      {/* Modal para Escolher/Adicionar Bancos */}
      {modalAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: '#0f172a' }}>Escolha os Bancos da Pasta</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
              Selecione quais aplicativos bancários você deseja acessar por aqui:
            </p>
            <div style={styles.modalList}>
              {BANCOS_DISPONIVEIS.map((b) => {
                const ativo = bancosSelecionados.some(sel => sel.id === b.id);
                return (
                  <div 
                    key={b.id} 
                    onClick={() => alternarBanco(b)}
                    style={{
                      ...styles.modalItem,
                      backgroundColor: ativo ? '#eff6ff' : '#f8fafc',
                      borderColor: ativo ? '#3b82f6' : '#e2e8f0'
                    }}
                  >
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>{b.icone}</span>
                    <span style={{ flex: 1, fontWeight: '500', color: '#1e293b' }}>{b.nome}</span>
                    <input type="checkbox" checked={ativo} readOnly style={{ cursor: 'pointer' }} />
                  </div>
                );
              })}
            </div>
            <button onClick={() => setModalAberto(false)} style={styles.modalCloseBtn}>
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    padding: '16px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0f172a'
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#64748b'
  },
  addBtn: {
    background: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#334155'
  },
  alertBanner: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    marginBottom: '18px',
    border: '1px solid #fee2e2'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    margin: '20px 0 30px',
    justifyItems: 'center'
  },
  appIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    width: '76px'
  },
  iconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginBottom: '8px'
  },
  appName: {
    fontSize: '12px',
    color: '#334155',
    fontWeight: '500',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '74px'
  },
  logoutBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    width: '100%',
    maxWidth: '360px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column'
  },
  modalList: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
    maxHeight: '300px'
  },
  modalItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid',
    cursor: 'pointer'
  },
  modalCloseBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};