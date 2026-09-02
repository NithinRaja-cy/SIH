import numpy as np

def generate_test_tone(freq=440.0, duration=2.0, sr=16000) -> np.ndarray:
    """Generates synthetic test tone waveform array for system validation."""
    t = np.linspace(0, duration, int(sr * duration), False)
    signal_wave = 0.5 * np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    return signal_wave.astype(np.float32)
