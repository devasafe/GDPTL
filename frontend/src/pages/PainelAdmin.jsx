import React, { useMemo, useState, useEffect } from 'react'
import useImoveis from '../hooks/useImoveis'
import { listarSessoes, criarSecao, atualizarSecao, removerSecao, getRender } from '../services/sessoesService'
import { criarImovel, atualizarImovel, removerImovel } from '../services/imoveisService'
import { listarTodasPostagens, criarPostagem, atualizarPostagem, removerPostagem } from '../services/postagensService'
import ImageUploader from '../components/ImageUploader'

const PainelAdmin = () => {
  const { imoveis, loading } = useImoveis()
  const [aba, setAba] = useState('imoveis')
  const [postagens, setPostagens] = useState([])
  const [loadingPostagens, setLoadingPostagens] = useState(true)
  const [sessoes, setSessoes] = useState([])
  const [loadingSessoes, setLoadingSessoes] = useState(true)
  const [showFormSessao, setShowFormSessao] = useState(false)
  const [editingSessaoId, setEditingSessaoId] = useState(null)
  const [draggedSessaoId, setDraggedSessaoId] = useState(null)
  const [formSessao, setFormSessao] = useState({ titulo: '', slug: '', tipo: 'destaque', criterio: {}, limite: 6, ordenacao: 'destaque', ativa: true, ordem: 0 })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [emojiPickerIndex, setEmojiPickerIndex] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagensAdicionais, setImagensAdicionais] = useState([])
  
  // Estado para imóveis
  const [form, setForm] = useState({
    titulo: '',
    slug: '',
    tipo: '',
    cidade: '',
    bairro: '',
    preco: '',
    area: '',
    quartos: '',
    suites: '',
    vagas: '',
    banheiros: '',
    descricao: '',
    destaque: false,
    canalPro: false,
    status: 'ativo',
    tagsText: '',
    caracteristicas: [],
  })

  // Estado para postagens
  const [formPostagem, setFormPostagem] = useState({
    titulo: '',
    slug: '',
    conteudo: '',
    imagem: '',
    categoria: 'noticia',
    status: 'publicado',
    dataEvento: '',
  })

  const emojiPalette = ['🛏️', '🛋️', '🛁', '🚿', '🚗', '📐', '✨', '🏙️', '🌿', '🔥', '🏊', '🎥', '🍷', '🧺']

  const total = useMemo(() => imoveis.length, [imoveis])

  useEffect(() => {
    if (aba === 'postagens') {
      const buscarPostagens = async () => {
        try {
          const data = await listarTodasPostagens()
          setPostagens(data || [])
        } catch (err) {
          console.error(err)
        } finally {
          setLoadingPostagens(false)
        }
      }
      buscarPostagens()
    }
  }, [aba])

  useEffect(() => {
    if (aba === 'sessoes') {
      const buscar = async () => {
        try {
          const data = await listarSessoes()
          setSessoes(data || [])
        } catch (err) {
          console.error(err)
        } finally {
          setLoadingSessoes(false)
        }
      }
      buscar()
    }
  }, [aba])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const resetForm = () => {
    setForm({
      titulo: '', slug: '', tipo: '', cidade: '', bairro: '', preco: '', area: '', quartos: '', suites: '', vagas: '', banheiros: '', descricao: '', diferencial: '', destaque: false, canalPro: false, status: 'ativo', tagsText: '', caracteristicas: [],
    })
    setEditingId(null)
    setEmojiPickerIndex(null)
    setImagensAdicionais([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        preco: Number(form.preco) || 0,
        tags: form.tagsText ? form.tagsText.split(',').map((t) => t.trim()).filter(Boolean) : [],
        caracteristicas: (form.caracteristicas || []).map((c) => ({
          titulo: c.titulo || '',
          icone: c.icone || '',
          valor: c.valor || '',
        })).filter((c) => c.titulo || c.icone || c.valor),
        // Armazenar todas as imagens no campo midias
        ...(imagensAdicionais.length > 0 && { 
          midias: imagensAdicionais.map(img => ({ 
            url: img.url, 
            tipo: 'foto',
            publicId: img.publicId 
          }))
        }),
      }

      // Evita enviar campos numéricos vazios (para não aparecer 0 no display)
      if (form.area !== '') payload.area = Number(form.area) || 0; else delete payload.area
      if (form.quartos !== '') payload.quartos = Number(form.quartos) || 0; else delete payload.quartos
      if (form.suites !== '') payload.suites = Number(form.suites) || 0; else delete payload.suites
      if (form.vagas !== '') payload.vagas = Number(form.vagas) || 0; else delete payload.vagas
      if (form.banheiros !== '') payload.banheiros = Number(form.banheiros) || 0; else delete payload.banheiros
      if (editingId) {
        await atualizarImovel(editingId, payload)
      } else {
        await criarImovel(payload)
      }
      setShowForm(false)
      resetForm()
      // Reload simplistic approach: hard refresh page data
      window.location.reload()
    } catch (err) {
      setError('Falha ao salvar imóvel. Verifique token/servidor.')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (imovel) => {
    setEditingId(imovel._id)
    setShowForm(true)
    setEmojiPickerIndex(null)
    setForm({
      titulo: imovel.titulo || '',
      slug: imovel.slug || '',
      tipo: imovel.tipo || '',
      cidade: imovel.cidade || '',
      bairro: imovel.bairro || '',
      preco: String(imovel.preco ?? ''),
      area: String(imovel.area ?? ''),
      quartos: String(imovel.quartos ?? ''),
      suites: String(imovel.suites ?? ''),
      vagas: String(imovel.vagas ?? ''),
      banheiros: String(imovel.banheiros ?? ''),
      descricao: imovel.descricao || '',
      destaque: Boolean(imovel.destaque),
      canalPro: Boolean(imovel.canalPro),
      status: imovel.status || 'ativo',
      tagsText: Array.isArray(imovel.tags) ? imovel.tags.join(', ') : '',
      caracteristicas: Array.isArray(imovel.caracteristicas) ? imovel.caracteristicas : [],
    })
  }

  const handleRemove = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja remover este imóvel?')
    if (!confirmar) return
    setError('')
    setRemovingId(id)
    try {
      await removerImovel(id)
      window.location.reload()
    } catch (err) {
      setError('Falha ao remover imóvel. Verifique token/servidor.')
    } finally {
      setRemovingId(null)
    }
  }

  const addCaracteristica = () => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: [...prev.caracteristicas, { titulo: '', icone: '', valor: '' }],
    }))
    setEmojiPickerIndex(null)
  }

  const updateCaracteristica = (index, field, value) => {
    setForm((prev) => {
      const next = [...prev.caracteristicas]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, caracteristicas: next }
    })
  }

  const removeCaracteristica = (index) => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, idx) => idx !== index),
    }))
    setEmojiPickerIndex(null)
  }

  const selectEmoji = (index, emoji) => {
    updateCaracteristica(index, 'icone', emoji)
    setEmojiPickerIndex(null)
  }

  // Handlers para Upload de Imagem
  const handleUploadSuccess = (files) => {
    // files é um array de objetos com { url, publicId }
    console.log('PainelAdmin.handleUploadSuccess chamado com:', files)
    if (files && Array.isArray(files) && files.length > 0) {
      console.log('✅ Adicionando', files.length, 'imagem(ns) ao estado')
      // Adicionar as novas imagens ao array de imagens adicionais
      setImagensAdicionais((prev) => {
        const novo = [...prev, ...files]
        console.log('✅ imagensAdicionais atualizado, total:', novo.length)
        console.log('✅ novo array:', novo)
        return novo
      })
      setUploadingImage(false)
    } else {
      console.log('❌ files está vazio ou nulo!')
    }
  }

  const removerImagem = (index) => {
    setImagensAdicionais((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadError = (error) => {
    setError(`Erro ao fazer upload: ${error}`)
    setUploadingImage(false)
  }

  // Handlers para Postagens
  const handleChangePostagem = (e) => {
    const { name, value } = e.target
    setFormPostagem((prev) => ({ ...prev, [name]: value }))
  }

  const resetFormPostagem = () => {
    setFormPostagem({
      titulo: '', slug: '', conteudo: '', imagem: '', categoria: 'noticia', status: 'publicado', dataEvento: '',
    })
    setEditingId(null)
  }

  const handleSubmitPostagem = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      // Converter dataEvento string para Date se existir
      const dadosPostagem = {
        ...formPostagem,
        dataEvento: formPostagem.dataEvento ? new Date(formPostagem.dataEvento) : null,
      }
      
      if (editingId) {
        await atualizarPostagem(editingId, dadosPostagem)
      } else {
        await criarPostagem(dadosPostagem)
      }
      setShowForm(false)
      resetFormPostagem()
      window.location.reload()
    } catch (err) {
      setError('Falha ao salvar postagem. Verifique token/servidor.')
    } finally {
      setSaving(false)
    }
  }

  const startEditPostagem = (postagem) => {
    setEditingId(postagem._id)
    setShowForm(true)
    const dataEvento = postagem.dataEvento 
      ? new Date(postagem.dataEvento).toISOString().split('T')[0]
      : ''
    setFormPostagem({
      titulo: postagem.titulo || '',
      slug: postagem.slug || '',
      conteudo: postagem.conteudo || '',
      imagem: postagem.imagem || '',
      categoria: postagem.categoria || 'noticia',
      status: postagem.status || 'publicado',
      dataEvento: dataEvento,
    })
  }

  const handleRemovePostagem = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja remover esta postagem?')
    if (!confirmar) return
    setError('')
    setRemovingId(id)
    try {
      await removerPostagem(id)
      window.location.reload()
    } catch (err) {
      setError('Falha ao remover postagem. Verifique token/servidor.')
    } finally {
      setRemovingId(null)
    }
  }

  // Sessões handlers
  const handleChangeSessao = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'ativa') {
      setFormSessao((prev) => ({ ...prev, ativa: checked }))
    } else if (name === 'limite' || name === 'ordem') {
      setFormSessao((prev) => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormSessao((prev) => ({ ...prev, [name]: value }))
    }
  }

  const resetFormSessao = () => {
    setFormSessao({ titulo: '', slug: '', tipo: 'destaque', criterio: {}, limite: 6, ordenacao: 'destaque', ativa: true, ordem: 0 })
    setEditingSessaoId(null)
  }

  const handleSubmitSessao = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let criterioPayload = formSessao.criterio || {}
      if (formSessao.tipo === 'query' && criterioPayload?.raw) {
        // parse simple key=value pairs separated by commas
        const parts = String(criterioPayload.raw).split(',').map((p) => p.trim()).filter(Boolean)
        const parsed = {}
        parts.forEach((p) => {
          const [k, v] = p.split('=').map((x) => x && x.trim())
          if (k) parsed[k] = v
        })
        criterioPayload = parsed
      }

      const payload = {
        ...formSessao,
        criterio: criterioPayload,
      }
      if (editingSessaoId) {
        await atualizarSecao(editingSessaoId, payload)
      } else {
        await criarSecao(payload)
      }
      setShowFormSessao(false)
      resetFormSessao()
      window.location.reload()
    } catch (err) {
      setError('Falha ao salvar sessão. Verifique token/servidor.')
    } finally {
      setSaving(false)
    }
  }

  const startEditSessao = (s) => {
    setEditingSessaoId(s._id)
    setShowFormSessao(true)
    setFormSessao({
      titulo: s.titulo || '',
      slug: s.slug || '',
      tipo: s.tipo || 'destaque',
      criterio: s.criterio || {},
      limite: s.limite || 6,
      ordenacao: s.ordenacao || 'destaque',
      ativa: Boolean(s.ativa),
      ordem: s.ordem || 0,
    })
  }

  const handleRemoveSessao = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja remover esta sessão?')
    if (!confirmar) return
    setError('')
    setRemovingId(id)
    try {
      await removerSecao(id)
      window.location.reload()
    } catch (err) {
      setError('Falha ao remover sessão. Verifique token/servidor.')
    } finally {
      setRemovingId(null)
    }
  }

  const toggleAtivaSessao = async (s) => {
    try {
      await atualizarSecao(s._id, { ...s, ativa: !s.ativa })
      const next = sessoes.map((x) => (x._id === s._id ? { ...x, ativa: !x.ativa } : x))
      setSessoes(next)
    } catch (err) {
      setError('Falha ao alternar sessão.')
    }
  }

  const handleDragStart = (e, sessao) => {
    setDraggedSessaoId(sessao._id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetSessao) => {
    e.preventDefault()
    if (!draggedSessaoId || draggedSessaoId === targetSessao._id) {
      setDraggedSessaoId(null)
      return
    }

    const draggedIndex = sessoes.findIndex((s) => s._id === draggedSessaoId)
    const targetIndex = sessoes.findIndex((s) => s._id === targetSessao._id)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Reorder locally
    const newSessoes = [...sessoes]
    const [draggedItem] = newSessoes.splice(draggedIndex, 1)
    newSessoes.splice(targetIndex, 0, draggedItem)

    // Update ordem values
    const updatePromises = newSessoes.map((s, idx) =>
      atualizarSecao(s._id, { ...s, ordem: idx })
    )

    try {
      setSessoes(newSessoes)
      await Promise.all(updatePromises)
      setError('')
    } catch (err) {
      setError('Falha ao reordenar sessões.')
      // Reload on error
      const data = await listarSessoes()
      setSessoes(data || [])
    } finally {
      setDraggedSessaoId(null)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:wght@400;500;600&display=swap');
        
        .painel-container {
          max-width: 1500px;
          margin: 6rem auto 2rem;
          padding: 0 2rem;
        }
        
        .painel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .painel-header-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #001a33;
          margin: 0 0 0.5rem;
          letter-spacing: -1px;
        }
        
        .painel-header-content p {
          color: #7a7a7a;
          margin: 0;
          font-size: 1rem;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%);
          color: #fff;
          padding: 0.85rem 1.8rem;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 12px rgba(196, 30, 58, 0.2);
          white-space: nowrap;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #e82d48 0%, #a0213d 100%);
          box-shadow: 0 8px 20px rgba(196, 30, 58, 0.3);
          transform: translateY(-2px);
        }
        
        .abas-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .aba-btn {
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          color: #7a7a7a;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          font-family: 'Playfair Display', serif;
        }
        
        .aba-btn.ativa {
          color: #c41e3a;
          border-bottom-color: #c41e3a;
        }
        
        .aba-btn:hover {
          color: #001a33;
        }
        
        .content-area {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="painel-container">
        {/* Header */}
        <div className="painel-header">
          <div className="painel-header-content">
            <h1>Painel de Controle</h1>
            <p>Gerencie seus imóveis, postagens e sessões com eficiência</p>
          </div>
          {aba !== 'canalpro' && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (aba === 'sessoes') {
                  setShowFormSessao((s) => !s);
                  setEditingSessaoId(null);
                } else {
                  setShowForm((s) => !s);
                  setEditingId(null);
                }
              }}
            >
              {aba === 'sessoes' ? (showFormSessao ? '✕ Cancelar' : '+ Adicionar Sessão') : (showForm ? '✕ Cancelar' : (aba === 'imoveis' ? '+ Novo Imóvel' : '+ Nova Postagem'))}
            </button>
          )}
        </div>

        {/* Abas */}
        <div className="abas-container">
          <button
            type="button"
            className={`aba-btn ${aba === 'imoveis' ? 'ativa' : ''}`}
            onClick={() => {setAba('imoveis'); setShowForm(false); setEditingId(null);}}
          >
            🏠 Imóveis ({total})
          </button>
          <button
            type="button"
            className={`aba-btn ${aba === 'postagens' ? 'ativa' : ''}`}
            onClick={() => {setAba('postagens'); setShowForm(false); setEditingId(null);}}
          >
            📰 Postagens ({postagens.length})
          </button>
          <button
            type="button"
            className={`aba-btn ${aba === 'sessoes' ? 'ativa' : ''}`}
            onClick={() => {setAba('sessoes'); setShowForm(false); setEditingId(null); setShowFormSessao(false); setEditingSessaoId(null);}}
          >
            📂 Sessões ({sessoes.length})
          </button>
          <button
            type="button"
            className={`aba-btn ${aba === 'canalpro' ? 'ativa' : ''}`}
            onClick={() => {setAba('canalpro'); setShowForm(false); setEditingId(null);}}
          >
            📡 Canal Pro ({imoveis.filter(i => i.canalPro).length})
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fecaca', 
            color: '#dc2626', 
            padding: '1rem', 
            borderRadius: '6px', 
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Conteúdo da Aba */}
        <div className="content-area">

      {aba === 'imoveis' && (
        <>
          {showForm && (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
          <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} style={inputStyle} />
          <input name="slug" placeholder="Slug (ex: casa-bela)" value={form.slug} onChange={handleChange} style={inputStyle} />
          
          {/* Seção de Upload de Imagem */}
          <div style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: '0.5rem 0', color: '#0f172a', fontWeight: 700 }}>Imagens do Imóvel</h4>
            <ImageUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              accept="image/*"
              maxSize={10 * 1024 * 1024}
              multiple={true}
            />
            {imagensAdicionais.length > 0 && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <p style={{ margin: '0 0 0.8rem', color: '#16a34a', fontWeight: 700 }}>✓ {imagensAdicionais.length} imagem(ns) adicionada(s)</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.8rem' }}>
                  {imagensAdicionais.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                      <img src={img.url} alt={`Imagem ${idx + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                      <button
                        type="button"
                        onClick={() => removerImagem(idx)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: '#c41e3a',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Remover imagem"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input name="tipo" placeholder="Tipo" value={form.tipo} onChange={handleChange} style={inputStyle} />
          <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} style={inputStyle} />
          <input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} style={inputStyle} />
          <input name="preco" placeholder="Preço" value={form.preco} onChange={handleChange} style={inputStyle} />
          <textarea name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} style={{ ...inputStyle, minHeight: '90px' }} />
          <input name="tagsText" placeholder="Tags (separe por vírgulas)" value={form.tagsText} onChange={handleChange} style={inputStyle} />
          <div style={{ gridColumn: '1 / -1', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>Características personalizadas</span>
              <button type="button" onClick={addCaracteristica} style={{ background: '#0ea5e9', color: '#fff', padding: '0.45rem 0.75rem', border: 'none', borderRadius: '8px', fontWeight: 700 }}>
                Adicionar
              </button>
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {form.caracteristicas.length === 0 && (
                <p style={{ margin: 0, color: '#475569' }}>Use “Adicionar” para incluir título, valor e escolher um emoji.</p>
              )}
              {form.caracteristicas.map((c, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr auto auto', gap: '0.4rem', alignItems: 'center', position: 'relative' }}>
                  <input
                    placeholder="Título (ex: Dormitórios)"
                    value={c.titulo}
                    onChange={(e) => updateCaracteristica(idx, 'titulo', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Valor (ex: 3 suítes)"
                    value={c.valor}
                    onChange={(e) => updateCaracteristica(idx, 'valor', e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setEmojiPickerIndex(emojiPickerIndex === idx ? null : idx)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff' }}>
                      {c.icone || '🙂'}
                    </button>
                    {emojiPickerIndex === idx && (
                      <div style={{ position: 'absolute', zIndex: 10, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem', top: '110%', right: 0, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
                        {emojiPalette.map((emoji) => (
                          <button key={emoji} type="button" onClick={() => selectEmoji(idx, emoji)} style={{ fontSize: '1.2rem', padding: '0.2rem', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => removeCaracteristica(idx)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem 0.7rem', fontWeight: 700 }}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} /> Destaque
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <input type="checkbox" name="canalPro" checked={form.canalPro} onChange={handleChange} />
            Divulgar no Canal Pro (ZAP / Viva Real / OLX)
          </label>
          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
          <div>
            <button type="submit" disabled={saving} style={{ background: '#16a34a', color: '#fff', padding: '0.6rem 0.9rem', border: 'none', borderRadius: '10px', fontWeight: 700 }}>
              {saving ? 'Salvando...' : (editingId ? 'Atualizar Imóvel' : 'Salvar Imóvel')}
            </button>
            {editingId && (
              <button type="button" onClick={() => { resetForm(); setShowForm(false) }} style={{ marginLeft: '0.5rem', background: '#ef4444', color: '#fff', padding: '0.6rem 0.9rem', border: 'none', borderRadius: '10px', fontWeight: 700 }}>
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '0.6rem' }}>
        {loading && <p>Carregando imóveis...</p>}
        {!loading && imoveis.map((i) => (
          <div key={i._id || i.slug} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#0f172a' }}>{i.titulo}</strong>
              <span style={{ color: '#475569' }}> — {i.cidade} / {i.bairro} • {i.tipo} • R$ {Number(i.preco).toLocaleString('pt-BR')}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => startEdit(i)} style={{ background: '#0ea5e9', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700 }}>
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleRemove(i._id)}
                disabled={removingId === i._id}
                style={{ background: '#ef4444', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700, opacity: removingId === i._id ? 0.8 : 1 }}
              >
                {removingId === i._id ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {aba === 'postagens' && (
        <>
          {showForm && (
            <form onSubmit={handleSubmitPostagem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
              <input name="titulo" placeholder="Título" value={formPostagem.titulo} onChange={handleChangePostagem} style={inputStyle} required />
              <input name="slug" placeholder="Slug (ex: evento-2025)" value={formPostagem.slug} onChange={handleChangePostagem} style={inputStyle} required />
              
              {/* Seção de Upload de Imagem para Postagem */}
              <div style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: '0.5rem 0', color: '#0f172a', fontWeight: 700 }}>Imagem da Postagem</h4>
                <ImageUploader
                  onUploadSuccess={(files) => {
                    setFormPostagem((prev) => ({
                      ...prev,
                      imagem: files[0].url,
                    }))
                  }}
                  onUploadError={(error) => setError(`Erro ao fazer upload: ${error}`)}
                  accept="image/*"
                  maxSize={10 * 1024 * 1024}
                />
                {formPostagem.imagem && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                    <p style={{ margin: '0 0 0.5rem', color: '#16a34a', fontWeight: 700 }}>✓ Imagem selecionada</p>
                    <img src={formPostagem.imagem} alt="Preview" style={{ maxWidth: '200px', borderRadius: '6px' }} />
                  </div>
                )}
              </div>

              <select name="categoria" value={formPostagem.categoria} onChange={handleChangePostagem} style={inputStyle}>
                <option value="noticia">Notícia</option>
                <option value="evento">Evento</option>
                <option value="outro">Outro</option>
              </select>

              {formPostagem.categoria === 'evento' && (
                <input 
                  type="date" 
                  name="dataEvento" 
                  value={formPostagem.dataEvento} 
                  onChange={handleChangePostagem} 
                  style={inputStyle}
                  placeholder="Data do Evento"
                />
              )}

              <select name="status" value={formPostagem.status} onChange={handleChangePostagem} style={inputStyle}>
                <option value="publicado">Publicado</option>
                <option value="rascunho">Rascunho</option>
              </select>
              <textarea name="conteudo" placeholder="Conteúdo" value={formPostagem.conteudo} onChange={handleChangePostagem} style={{ ...inputStyle, minHeight: '120px', gridColumn: '1 / -1' }} required />
              <div>
                <button type="submit" disabled={saving} style={{ background: '#16a34a', color: '#fff', padding: '0.6rem 0.9rem', border: 'none', borderRadius: '10px', fontWeight: 700 }}>
                  {saving ? 'Salvando...' : (editingId ? 'Atualizar Postagem' : 'Salvar Postagem')}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { resetFormPostagem(); setShowForm(false) }} style={{ marginLeft: '0.5rem', background: '#ef4444', color: '#fff', padding: '0.6rem 0.9rem', border: 'none', borderRadius: '10px', fontWeight: 700 }}>
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {loadingPostagens && <p>Carregando postagens...</p>}
            {!loadingPostagens && postagens.map((p) => (
              <div key={p._id || p.slug} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{p.titulo}</strong>
                  <span style={{ color: '#475569' }}> — {p.categoria} • {p.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => startEditPostagem(p)} style={{ background: '#0ea5e9', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700 }}>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePostagem(p._id)}
                    disabled={removingId === p._id}
                    style={{ background: '#ef4444', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700, opacity: removingId === p._id ? 0.8 : 1 }}
                  >
                    {removingId === p._id ? 'Removendo...' : 'Remover'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {aba === 'sessoes' && (
        <>
          {showFormSessao && (
            <form onSubmit={handleSubmitSessao} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
              <input name="titulo" placeholder="Título" value={formSessao.titulo} onChange={(e) => setFormSessao((p)=>({...p,titulo:e.target.value}))} style={inputStyle} required />
              <input name="slug" placeholder="Slug (ex: frente-ao-mar)" value={formSessao.slug} onChange={(e) => setFormSessao((p)=>({...p,slug:e.target.value}))} style={inputStyle} />
              <select name="tipo" value={formSessao.tipo} onChange={(e) => setFormSessao((p)=>({...p,tipo:e.target.value, criterio: {}}))} style={inputStyle}>
                <option value="destaque">Destaque</option>
                <option value="cidade">Cidade</option>
                <option value="tag">Tag</option>
                <option value="custom">Custom (slugs)</option>
                <option value="query">Query (simples)</option>
              </select>
              {/* criterio input simplified */}
              {formSessao.tipo === 'cidade' && (
                <input placeholder="Cidade (ex: Fortaleza)" value={formSessao.criterio?.cidade || ''} onChange={(e)=> setFormSessao((p)=>({...p, criterio: {...p.criterio, cidade: e.target.value}}))} style={inputStyle} />
              )}
              {formSessao.tipo === 'tag' && (
                <input placeholder="Tag (ex: praia)" value={formSessao.criterio?.tag || ''} onChange={(e)=> setFormSessao((p)=>({...p, criterio: {...p.criterio, tag: e.target.value}}))} style={inputStyle} />
              )}
              {formSessao.tipo === 'custom' && (
                <input placeholder="Slugs separados por vírgula" value={(formSessao.criterio?.slugs || []).join(',')} onChange={(e)=> setFormSessao((p)=>({...p, criterio: {...p.criterio, slugs: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}}))} style={inputStyle} />
              )}
              {formSessao.tipo === 'query' && (
                <input placeholder='Chave=Valor (ex: cidade=Fortaleza)' value={formSessao.criterio?.raw || ''} onChange={(e)=> setFormSessao((p)=>({...p, criterio: {...p.criterio, raw: e.target.value}}))} style={inputStyle} />
              )}

              <input name="limite" type="number" placeholder="Limite" value={formSessao.limite} onChange={(e)=> setFormSessao((p)=>({...p, limite: Number(e.target.value)}))} style={inputStyle} />
              <select name="ordenacao" value={formSessao.ordenacao} onChange={(e)=> setFormSessao((p)=>({...p, ordenacao: e.target.value}))} style={inputStyle}>
                <option value="destaque">Destaque</option>
                <option value="data">Data</option>
                <option value="preco">Preço crescente</option>
                <option value="-preco">Preço decrescente</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <input type="checkbox" name="ativa" checked={formSessao.ativa} onChange={(e)=> setFormSessao((p)=>({...p, ativa: e.target.checked}))} /> Ativa
              </label>
              <div>
                <button type="submit" disabled={saving} style={{ background: '#16a34a', color: '#fff', padding: '0.6rem 0.9rem', border: 'none', borderRadius: '10px', fontWeight: 700 }}>
                  {saving ? 'Salvando...' : (editingSessaoId ? 'Atualizar Sessão' : 'Salvar Sessão')}
                </button>
                {editingSessaoId && (
                  <button type="button" onClick={() => { resetFormSessao(); setShowFormSessao(false) }} style={{ marginLeft: '0.5rem', background: '#ef4444', color: '#fff', padding: '0.6rem 0.9rem', border: 'none', borderRadius: '10px', fontWeight: 700 }}>
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {loadingSessoes && <p>Carregando sessões...</p>}
            {!loadingSessoes && sessoes.map((s) => (
              <div
                key={s._id || s.slug}
                draggable
                onDragStart={(e) => handleDragStart(e, s)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, s)}
                style={{
                  border: draggedSessaoId === s._id ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: draggedSessaoId === s._id ? '#f0f9ff' : '#fff',
                  cursor: 'move',
                  opacity: draggedSessaoId === s._id ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <strong style={{ color: '#0f172a' }}>⋮⋮ {s.titulo}</strong>
                  <span style={{ color: '#475569' }}> — {s.tipo} • limite {s.limite}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => startEditSessao(s)} style={{ background: '#0ea5e9', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700 }}>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSessao(s._id)}
                    disabled={removingId === s._id}
                    style={{ background: '#ef4444', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700, opacity: removingId === s._id ? 0.8 : 1 }}
                  >
                    {removingId === s._id ? 'Removendo...' : 'Remover'}
                  </button>
                  <button type="button" onClick={() => toggleAtivaSessao(s)} style={{ background: s.ativa ? '#f97316' : '#10b981', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700 }}>
                    {s.ativa ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {aba === 'canalpro' && (() => {
        const feedUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api'}/canal-pro/feed`
        const imoveisFeed = imoveis.filter(i => i.canalPro)
        return (
          <>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.2rem 1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ color: '#15803d', fontWeight: 700, margin: '0 0 0.5rem' }}>📡 URL do Feed — cadastre no painel do Canal Pro</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <code style={{ background: '#dcfce7', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.9rem', color: '#166534', wordBreak: 'break-all' }}>
                  {feedUrl}
                </code>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(feedUrl); alert('URL copiada!') }}
                  style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Copiar
                </button>
                <a href={feedUrl} target="_blank" rel="noreferrer" style={{ background: '#0ea5e9', color: '#fff', borderRadius: '8px', padding: '0.4rem 0.8rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Abrir Feed
                </a>
              </div>
            </div>
            <p style={{ color: '#475569', marginBottom: '0.75rem' }}>
              {imoveisFeed.length === 0
                ? 'Nenhum imóvel marcado para divulgação. Edite um imóvel e marque "Divulgar no Canal Pro".'
                : `${imoveisFeed.length} imóvel(is) sendo divulgado(s):`}
            </p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {imoveisFeed.map(i => (
                <div key={i._id} style={{ border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.7rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4' }}>
                  <div>
                    <strong style={{ color: '#0f172a' }}>{i.titulo}</strong>
                    <span style={{ color: '#475569' }}> — {i.cidade} / {i.bairro} • R$ {Number(i.preco).toLocaleString('pt-BR')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAba('imoveis'); startEdit(i) }}
                    style={{ background: '#0ea5e9', color: '#fff', padding: '0.4rem 0.7rem', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </>
        )
      })()}
        </div>
      </div>
    </>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  background: '#fafbfc',
  color: '#0f172a',
  fontSize: '0.95rem',
  fontFamily: "'Lora', serif",
  transition: 'all 0.3s ease',
  outline: 'none',
};

export default PainelAdmin
