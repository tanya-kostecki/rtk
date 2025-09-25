import { useEffect } from 'react'

// Компонент, срабатывающий после успешной OAuth авторизации,
// его цель - отправить код обратно в главное окно приложения и закрыть popup
export const OAuthCallback = () => {
  useEffect(() => {
    // Получаем текущий URL
    const url = new URL(window.location.href)

    // Извлекаем code из параметров запроса
    const code = url.searchParams.get('code')

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*')
    }

    window.close()
  }, [])

  return <p>Logging you in...</p>
}
