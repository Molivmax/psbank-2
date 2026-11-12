import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Settings, Trash2, X, Check, ShieldCheck } from 'lucide-react';
import { AppLauncher } from '@capacitor/app-launcher';

const CATALOGO_BANCOS = [
  {
    id: 'nubank',
    name: 'Nubank',
    pkg: 'com.nu.production',
    bg: '#820AD1',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M13 31V21c0-3.3 2.7-6 6-6s6 2.7 6 6v10M23 17v10c0 3.3 2.7 6 6 6s6-2.7 6-6V17" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'itau',
    name: 'Itaú',
    pkg: 'com.itau',
    bg: '#EC7000',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect x="10" y="10" width="28" height="28" rx="6" fill="#003399"/>
        <text x="24" y="30" textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="bold" fontFamily="sans-serif">itaú</text>
      </svg>
    )
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    pkg: 'com.bradesco',
    bg: '#CC092F',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M14 28c0-6 4.5-11 10-11s10 5 10 11" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M19 31c0-3.5 2.2-6 5-6s5 2.5 5 6" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="24" cy="34" r="2" fill="#FFF"/>
      </svg>
    )
  },
  {
    id: 'inter',
    name: 'Inter',
    pkg: 'br.com.intermedium',
    bg: '#FF7A00',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <text x="24" y="29" textAnchor="middle" fill="#FFF" fontSize="15" fontWeight="bold" fontFamily="sans-serif">inter</text>
      </svg>
    )
  },
  {
    id: 'santander',
    name: 'Santander',
    pkg: 'com.santander.app',
    bg: '#EC0000',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M24 13c-2 4-7 6-7 11 0 3.5 3 6 7 6s7-2.5 7-6c0-2-1-3.5-2.5-5 0 2-1.5 3.5-3 3.5-2 0-3-1.5-3-3.5 0-2 1.5-4 1.5-6z" fill="#FFF"/>
        <path d="M14 33c3 2 17 2 20 0" stroke="#FFF" strokeWidth="2.8" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'caixa',
    name: 'Caixa',
    pkg: 'br.com.gabba.Caixa',
    bg: '#005CA9',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M15 16l9 8-9 8M33 16l-9 8 9 8" stroke="#F39200" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    pkg: 'br.com.bb.android',
    bg: '#F8D117',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M16 20l8-6 8 6-8 6-8-6zm0 8l8-6 8 6-8 6-8-6z" stroke="#0038A8" strokeWidth="3.5" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'c6',
    name: 'C6 Bank',
    pkg: 'com.c6bank.app',
    bg: '#1A1A1A',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <text x="24" y="30" textAnchor="middle" fill="#FFF" fontSize="17" fontWeight="bold" fontFamily="sans-serif">C6</text>
      </svg>
    )
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    pkg: 'com.mercadopago.wallet',
    bg: '#009EE3',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <ellipse cx="24" cy="24" rx="13" ry="9" stroke="#FFF" strokeWidth="3"/>
        <path d="M17 24c3-3 11-3 14 0" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'picpay',
    name: 'PicPay',
    pkg: 'com.picpay',
    bg: '#11C76F',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect x="15" y="14" width="12" height="14" rx="3" stroke="#FFF" strokeWidth="3"/>
        <path d="M15 24v10" stroke="#FFF" strokeWidth="3" strokeLinecap="round"/>
        <rect x="29" y="14" width="5" height="5" rx="1" fill="#FFF"/>
      </svg>
    )
  },
  {
    id: 'pagbank',
    name: 'PagBank',
    pkg: 'br.com.uol.ps.myaccount',
    bg: '#00A859',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="22" cy="24" r="8" stroke="#FFF" strokeWidth="3"/>
        <circle cx="28" cy="24" r="8" stroke="#FFCB05" strokeWidth="3"/>
      </svg>
    )
  },
  {
    id: 'neon',
    name: 'Neon',
    pkg: 'br.com.neon',
    bg: '#00A4E4',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="10" stroke="#FFF" strokeWidth="4"/>
      </svg>
    )
  },
  {
    id: 'btg',
    name: 'BTG Pactual',
    pkg: 'com.btg.pactual.banking',
    bg: '#001E62',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <text x="24" y="29" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold" fontFamily="sans-serif">BTG</text>
      </svg>
    )
  },
  {
    id: 'xp',
    name: 'XP Investimentos',
    pkg: 'br.com.xp.carteira',
    bg: '#000000',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <text x="24" y="30" textAnchor="middle" fill="#FBC02D" fontSize="18" fontWeight="bold" fontFamily="sans-serif">XP</text>
      </svg>
    )
  },
  {
    id: 'sicredi',
    name: 'Sicredi',
    pkg: 'br.com.sicredi.app',
    bg: '#3FA110',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M18 18l6 6-6 6M25 18l6 6-6 6" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'sicoob',
    name: 'Sicoob',
    pkg: 'br.com.sicoobnet',
    bg: '#003641',
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M24 14l10 18H14L24 14z" stroke="#7DB61C" strokeWidth="3.5" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const BankAppsFolder = ({ isEmergencyMode, onLogout }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isManaging, setIsManaging] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const inicializarBancos = async () => {
      const saved = localStorage.getItem('pastaSeguraBankIds');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedIds(parsed);
            setScanning(false);
            return;
          }
        } catch {
          // continua para leitura automática
        }
      }

      // Varredura automática dos bancos instalados no aparelho
      const instalados = [];
      for (const banco of CATALOGO_BANCOS) {
        try {
          const res = await AppLauncher.canOpenUrl({ url: banco.pkg });
          if (res && res.value) {
            instalados.push(banco.id);
          }
        } catch {
          // ignora se não encontrado
        }
      }

      // Se encontrou bancos instalados no celular, exibe eles; senão exibe os 6 principais
      const iniciais = instalados.length > 0
        ? instalados
        : ['nubank', 'itau', 'bradesco', 'inter', 'santander', 'caixa'];

      setSelectedIds(iniciais);
      localStorage.setItem('pastaSeguraBankIds', JSON.stringify(iniciais));
      setScanning(false);
    };

    inicializarBancos();
  }, []);

  const salvarLista = (novaLista) => {
    setSelectedIds(novaLista);
    localStorage.setItem('pastaSeguraBankIds', JSON.stringify(novaLista));
  };

  const abrirBanco = async (banco) => {
    if (isManaging) return;
    try {
      const canOpen = await AppLauncher.canOpenUrl({ url: banco.pkg });
      if (canOpen.value) {
        await AppLauncher.openUrl({ url: banco.pkg });
        return;
      }
    } catch {
      // fallback abaixo
    }
    window.location.href = `android-app://${banco.pkg}`;
  };

  const removerBanco = (id) => {
    const atualizada = selectedIds.filter((item) => item !== id);
    salvarLista(atualizada);
  };

  const alternarBancoNoCatalogo = (id) => {
    if (selectedIds.includes(id)) {
      salvarLista(selectedIds.filter((item) => item !== id));
    } else {
      salvarLista([...selectedIds, id]);
    }
  };

  const bancosAtivos = CATALOGO_BANCOS.filter((b) => selectedIds.includes(b.id));

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl p-6 flex flex-col justify-between min-h-[540px]">
        <div>
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                Pasta Bancária
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {scanning ? 'Verificando bancos instalados...' : 'Seus aplicativos protegidos'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsManaging(!isManaging)}
              className="text-xs font-medium rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              {isManaging ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" /> Concluir
                </>
              ) : (
                <>
                  <Settings className="w-3.5 h-3.5" /> Gerenciar
                </>
              )}
            </Button>
          </div>

          {/* Grade de 3 Colunas com Ícones dos Bancos */}
          <div className="grid grid-cols-3 gap-4">
            {bancosAtivos.map((banco) => (
              <div
                key={banco.id}
                onClick={() => abrirBanco(banco)}
                className="relative flex flex-col items-center justify-center cursor-pointer group"
              >
                {isManaging && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removerBanco(banco.id);
                    }}
                    className="absolute -top-1.5 right-2 z-10 bg-red-500 text-white rounded-full p-1 shadow-md"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                <div
                  style={{ backgroundColor: banco.bg }}
                  className="w-16 h-16 rounded-2xl shadow-md flex items-center justify-center transition-transform group-active:scale-90"
                >
                  {banco.icon}
                </div>
                <span className="text-xs font-medium text-slate-700 mt-2 text-center line-clamp-1">
                  {banco.name}
                </span>
              </div>
            ))}

            {/* Botão + Adicionar */}
            <div
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                <Plus className="w-7 h-7" />
              </div>
              <span className="text-xs font-medium text-slate-600 mt-2">Adicionar</span>
            </div>
          </div>
        </div>

        {/* Botão Bloquear Pasta */}
        <div className="mt-8 pt-4">
          <Button
            onClick={onLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-6 rounded-2xl shadow-none border border-red-100 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Bloquear Pasta
          </Button>
        </div>
      </div>

      {/* Modal para Adicionar / Escolher Bancos */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base">Selecionar Aplicativos Bancários</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2">
              {CATALOGO_BANCOS.map((banco) => {
                const ativo = selectedIds.includes(banco.id);
                return (
                  <div
                    key={banco.id}
                    onClick={() => alternarBancoNoCatalogo(banco.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition-colors ${
                      ativo ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: banco.bg }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      >
                        {banco.icon}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{banco.name}</span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        ativo ? 'bg-blue-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {ativo && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5"
            >
              Confirmar Seleção
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAppsFolder;
