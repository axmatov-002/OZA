import React, { useState, useRef, useCallback } from 'react'

/**
 * High-Performance Hardware-Accelerated 3D Tilt Component
 * Creates an authentic physical 3D card effect with:
 * - Real-time perspective cursor tracking (rotateX, rotateY)
 * - Dynamic specular light glare
 * - Support for inner 3D depth layering via translateZ
 */
const TiltCard3D = ({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1000,
  glare = true,
  scale = 1.02,
  style = {},
  ...props
}) => {
  const cardRef = useRef(null)
  const [transformStyle, setTransformStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
  })
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)'
  })

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.08s ease-out'
    })

    if (glare) {
      setGlareStyle({
        opacity: 1,
        background: `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`
      })
    }
  }, [maxTilt, perspective, scale, glare])

  const handleMouseLeave = useCallback(() => {
    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
    })
    if (glare) {
      setGlareStyle((prev) => ({ ...prev, opacity: 0 }))
    }
  }, [perspective, glare])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...transformStyle,
        ...style
      }}
      {...props}
    >
      {children}
      {glare && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 z-30"
          style={glareStyle}
        />
      )}
    </div>
  )
}

export default TiltCard3D
