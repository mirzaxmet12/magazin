import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from '@mui/material'
import { useState } from 'react'


function Theme() {
    const [theme, setTheme] = useState(true)

    const handleChange = () => {
        if (theme) {
            setTheme(false)
            document.body.classList.add('dark')
        }
        else {
            setTheme(true)
            document.body.classList.remove('dark')
        }
    }

    return (
        <Box sx={{
            // bgcolor: 'var(--bg-card-color)',
            width: '35px',
            zIndex: 5

        }}>
            <button onClick={handleChange} style={{
                display: 'flex',
                background: 'var(--background-color)',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0ea5e9',
                fontWeight: 'bold',
                border: '1px solid var(--navbar-border-color)',
                padding: '5px 7px',
                borderRadius: '5px',
                gap: 1,
                fontSize: 20,
            }
            }><FontAwesomeIcon icon={theme ? faMoon : faSun} color='#0ea5e9' /></button>
        </Box >
    )
}

export default Theme
