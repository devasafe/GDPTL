import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { login as loginApi } from '../services/authService'

// Cores sofisticadas
const PRIMARY_COLOR = '#001d44'
const SECONDARY_COLOR = '#c41e3a'
const ACCENT_COLOR = '#ffffff'
const TEXT_DARK = '#1a1a1a'
const TEXT_LIGHT = '#666666'

const LOGIN_TOKEN = 'lulucorretorbravo'
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutos em ms

const Login = () => {
  const [form, setForm] = useState({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Verificar token na URL
    const token = searchParams.get('token')
    if (token === LOGIN_TOKEN) {
      setIsTokenValid(true)
    }

    // Verificar se está bloqueado
    const lockoutData = localStorage.getItem('login_lockout')
    if (lockoutData) {
      const lockoutTime = JSON.parse(lockoutData)
      const now = Date.now()
      if (now < lockoutTime.expiresAt) {
        setIsLockedOut(true)
        setRemainingTime(Math.ceil((lockoutTime.expiresAt - now) / 1000))
      } else {
        localStorage.removeItem('login_lockout')
        localStorage.removeItem('login_attempts')
      }
    }
  }, [searchParams])

  // Atualizar tempo de bloqueio
  useEffect(() => {
    if (!isLockedOut) return

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsLockedOut(false)
          localStorage.removeItem('login_lockout')
          localStorage.removeItem('login_attempts')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isLockedOut])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isTokenValid) {
      setError('Acesso não autorizado. Token inválido ou ausente.')
      return
    }

    if (isLockedOut) {
      setError(`Muitas tentativas de login. Tente novamente em ${remainingTime} segundos.`)
      return
    }

    setError('')
    setLoading(true)

    try {
      const { token } = await loginApi({ email: form.email, senha: form.senha })
      if (token) {
        // Limpar tentativas e bloqueios ao fazer login com sucesso
        localStorage.removeItem('login_attempts')
        localStorage.removeItem('login_lockout')
        localStorage.setItem('gc_token', token)
        const from = location.state?.from || '/admin'
        navigate(from)
      } else {
        setError('Resposta inesperada do servidor.')
        incrementLoginAttempts()
      }
    } catch (err) {
      setError('Credenciais inválidas ou servidor indisponível.')
      incrementLoginAttempts()
    } finally {
      setLoading(false)
    }
  }

  const incrementLoginAttempts = () => {
    const attempts = JSON.parse(localStorage.getItem('login_attempts') || '0')
    const newAttempts = attempts + 1

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutData = {
        expiresAt: Date.now() + LOCKOUT_TIME,
      }
      localStorage.setItem('login_lockout', JSON.stringify(lockoutData))
      setIsLockedOut(true)
      setRemainingTime(Math.ceil(LOCKOUT_TIME / 1000))
      setError(`Muitas tentativas. Bloqueado por ${Math.ceil(LOCKOUT_TIME / 60000)} minutos.`)
    } else {
      localStorage.setItem('login_attempts', newAttempts.toString())
      setError(`Credenciais inválidas. ${MAX_ATTEMPTS - newAttempts} tentativas restantes.`)
    }
  }

  return (
    <section style={{ maxWidth: '420px', margin: '9rem auto 3rem', background: ACCENT_COLOR, border: `2px solid ${PRIMARY_COLOR}`, borderRadius: '8px', padding: '2.5rem', boxShadow: '0 10px 40px -10px rgba(0, 29, 68, 0.2)' }}>
      <h1 style={{ margin: '0 0 0.5rem', color: PRIMARY_COLOR, fontSize: '2rem', fontWeight: 700 }}>Admin</h1>
      <p style={{ margin: '0 0 2rem', color: TEXT_LIGHT }}>Entre com sua conta para gerenciar imóveis</p>
      
      {!isTokenValid && (
        <p style={{ color: SECONDARY_COLOR, marginTop: 0, marginBottom: '1rem', fontWeight: 600, padding: '1rem', background: '#ffe5e5', borderRadius: '4px', textAlign: 'center' }}>
          ⚠️ Acesso não autorizado. Token inválido.
        </p>
      )}
      
      {error && (
        <p style={{ color: SECONDARY_COLOR, marginTop: 0, marginBottom: '1rem', fontWeight: 600, padding: '1rem', background: '#ffe5e5', borderRadius: '4px' }}>
          {error}
        </p>
      )}
      
      {isTokenValid ? (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <input 
            name="email" 
            placeholder="E-mail" 
            value={form.email} 
            onChange={handleChange} 
            style={inputStyle} 
            disabled={isLockedOut}
            required 
          />
        <input 
          name="senha" 
          type="password" 
          placeholder="Senha" 
          value={form.senha} 
          onChange={handleChange} 
          style={inputStyle} 
          disabled={isLockedOut}
          required 
        />
        <button 
          type="submit" 
          disabled={loading || isLockedOut} 
          style={{ 
            background: `linear-gradient(135deg, ${SECONDARY_COLOR} 0%, #8B1528 100%)`, 
            color: ACCENT_COLOR, 
            padding: '1rem', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 700, 
            opacity: loading || isLockedOut ? 0.7 : 1, 
            cursor: isLockedOut ? 'not-allowed' : 'pointer', 
            boxShadow: `0 4px 12px rgba(196, 30, 58, 0.3)`, 
            transition: 'all 0.3s' 
          }}
        >
          {loading ? 'Entrando...' : isLockedOut ? `Bloqueado (${remainingTime}s)` : 'Entrar'}
        </button>
      </form>
      ) : (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          background: '#ffe5e5', 
          borderRadius: '4px' 
        }}>
          <p style={{ color: SECONDARY_COLOR, fontWeight: 600, margin: '0 0 1rem' }}>
            ⚠️ Acesso não autorizado
          </p>
          <p style={{ color: TEXT_LIGHT, margin: 0, fontSize: '0.9rem' }}>
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      )}
    </section>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '6px',
  border: `2px solid ${PRIMARY_COLOR}`,
  background: ACCENT_COLOR,
  color: TEXT_DARK,
  fontSize: '1rem',
}

export default Login
