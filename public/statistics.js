async function loadStatistics() {
  const errorMessage = document.querySelector('#statistics-error')

  try {
    const response = await fetch('/api/statistics')

    if (response.status === 401) {
      window.location.href = '/signin.html'
      return
    }

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to load game stats.')
    }

    document.querySelector('#total-battles').textContent = data.total_battles ?? 0
    document.querySelector('#wins').textContent = data.wins ?? 0
    document.querySelector('#losses').textContent = data.losses ?? 0
    document.querySelector('#draws').textContent = data.draws ?? 0
    document.querySelector('#best-run').textContent = data.best_run ?? 0
  } catch (error) {
    errorMessage.textContent = error.message
  }
}

loadStatistics()
