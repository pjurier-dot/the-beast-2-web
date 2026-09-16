"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import config from "./launcher-config.json"

type Phase = "enter" | "visible" | "exit" | "done"

function animationName(type: string | undefined) {
  const map: Record<string, string> = {
    fadeIn: "fadeIn",
    fadeOut: "fadeOut",
    fadeBlur: "fadeBlurIn",
    fadeZoom: "fadeZoomIn",
    fadeSlide: "fadeSlideIn",
    fadeWipe: "fadeWipeIn",
    fadeFlash: "fadeFlashIn",
    slideUp: "slideUp",
    slideDown: "slideDown",
    slideLeft: "slideLeft",
    slideRight: "slideRight",
    scaleUp: "scaleUp",
    bounce: "bounceIn",
    bounceIn: "bounceIn",
    rotate: "rotateIn",
    rotateIn: "rotateIn",
    blurIn: "blurIn",
    clipReveal: "clipReveal",
    pixelReveal: "pixelReveal",
    flip: "flipIn",
    elastic: "elasticIn",
  }
  return map[String(type || "")] || "fadeIn"
}

function animationVariables(animation: any, isExit = false): React.CSSProperties {
  const distance = Number(animation?.distance ?? animation?.fadeDistance ?? 46)
  const direction = animation?.direction ?? animation?.fadeDirection ?? "up"
  const x = direction === "left" ? -distance : direction === "right" ? distance : 0
  const y = direction === "up" ? -distance : direction === "down" ? distance : 0
  return {
    ["--fade-from" as string]: String(Number(animation?.fromOpacity ?? animation?.fadeFrom ?? (isExit ? 100 : 0)) / 100),
    ["--fade-to" as string]: String(Number(animation?.toOpacity ?? animation?.fadeTo ?? (isExit ? 0 : 100)) / 100),
    ["--fade-x" as string]: String(x) + "px",
    ["--fade-y" as string]: String(y) + "px",
    ["--fade-blur" as string]: String(animation?.blurAmount ?? animation?.fadeBlur ?? 18) + "px",
    ["--fade-scale" as string]: String(Number(animation?.scaleFrom ?? animation?.fadeScale ?? (isExit ? 106 : 92)) / 100),
    ["--fade-flash" as string]: String(Number(animation?.flashBrightness ?? 180) / 100),
    ["--fade-wipe-from" as string]: direction === "left" ? "inset(0 0 0 100%)" : direction === "up" ? "inset(100% 0 0 0)" : direction === "down" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)",
    ["--fade-wipe-out" as string]: direction === "left" ? "inset(0 100% 0 0)" : direction === "up" ? "inset(0 0 100% 0)" : direction === "down" ? "inset(100% 0 0 0)" : "inset(0 0 0 100%)",
  }
}

function animationEasing(animation: any) {
  if (animation?.easing === "bounce") return "cubic-bezier(.68,-.55,.265,1.55)"
  if (animation?.easing === "elastic") return "cubic-bezier(.16,1.35,.34,1)"
  if (animation?.easing === "custom") return animation?.customBezier || "cubic-bezier(.22,.8,.22,1)"
  return animation?.easing || "ease-out"
}

function backgroundStyle(background: any): React.CSSProperties {
  if (background?.type === "gradient" && background.gradient) {
    const stops = (background.gradient.colors || []).map((item: any) => item.color + " " + item.position + "%").join(", ")
    const value = background.gradient.type === "radial"
      ? "radial-gradient(circle at 50% 42%, " + stops + ")"
      : "linear-gradient(" + (background.gradient.angle || 0) + "deg, " + stops + ")"
    return { backgroundImage: value, backgroundColor: background.color || "#020202" }
  }
  return { backgroundColor: background?.color || "#020202" }
}

function iconForButton(element: any) {
  if (!element.buttonIcon || element.buttonIcon === "none") return ""
  if (element.buttonIcon === "play") return "▶"
  if (element.buttonIcon === "arrow") return "→"
  if (element.buttonIcon === "download") return "↓"
  if (element.buttonIcon === "spark") return "✦"
  return element.buttonIconText || "✦"
}

function textOutline(element: any): React.CSSProperties {
  const preset = element.outlinePreset || "none"
  const width = Math.max(0, Number(element.outlineWidth || 0))
  const offset = Math.max(0, Number(element.outlineOffset || 0))
  const color = element.outlineColor || "#000"
  if (preset === "none" || width <= 0) return {}
  const spread = width + offset
  const dirs = [
    spread + "px 0 0 " + color,
    -spread + "px 0 0 " + color,
    "0 " + spread + "px 0 " + color,
    "0 " + -spread + "px 0 " + color,
    spread + "px " + spread + "px 0 " + color,
    -spread + "px " + spread + "px 0 " + color,
    spread + "px " + -spread + "px 0 " + color,
    -spread + "px " + -spread + "px 0 " + color,
  ]
  if (preset === "cartoon") return { textShadow: dirs.join(",") + "," + spread * 1.6 + "px " + spread * 1.8 + "px 0 rgba(0,0,0,.45)" }
  if (preset === "sticker") return { textShadow: dirs.join(","), filter: "drop-shadow(0 " + Math.max(2,width) + "px 0 rgba(0,0,0,.25))" }
  if (preset === "neon") return { textShadow: "0 0 " + width * 2 + "px " + color + ",0 0 " + width * 5 + "px " + color }
  if (preset === "rough") return { textShadow: spread + "px " + spread + "px 0 " + color + "," + -Math.max(1,spread/2) + "px " + Math.max(1,spread/2) + "px 0 " + color }
  return { WebkitTextStroke: width + "px " + color }
}

function boxOutline(element: any) {
  const preset = element.outlinePreset || "none"
  const width = Math.max(0, Number(element.outlineWidth || 0))
  const offset = Math.max(0, Number(element.outlineOffset || 0))
  const color = element.outlineColor || "#000"
  if (preset === "none" || width <= 0) return ""
  const spread = width + offset
  if (preset === "cartoon") return "drop-shadow(" + spread + "px " + spread + "px 0 " + color + ") drop-shadow(" + -width + "px " + -width + "px 0 " + color + ")"
  if (preset === "sticker") return "drop-shadow(0 0 " + spread + "px " + color + ") drop-shadow(0 " + spread + "px 0 rgba(0,0,0,.3))"
  if (preset === "neon") return "drop-shadow(0 0 " + spread * 2 + "px " + color + ") drop-shadow(0 0 " + spread * 4 + "px " + color + ")"
  if (preset === "rough") return "drop-shadow(" + spread + "px " + Math.max(1,spread/2) + "px 0 " + color + ")"
  return "drop-shadow(0 0 " + width + "px " + color + ")"
}


function timelineEase(value:number, easing:string, custom?:string) {
  const t = Math.max(0, Math.min(1, value))
  if (easing === "hold") return 0
  if (easing === "ease-in") return t * t
  if (easing === "ease-out") return 1 - Math.pow(1 - t, 2)
  if (easing === "ease-in-out" || easing === "ease") return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  if (easing === "bounce") {
    const n1 = 7.5625, d1 = 2.75
    if (t < 1 / d1) return n1 * t * t
    if (t < 2 / d1) { const x = t - 1.5 / d1; return n1 * x * x + .75 }
    if (t < 2.5 / d1) { const x = t - 2.25 / d1; return n1 * x * x + .9375 }
    const x = t - 2.625 / d1; return n1 * x * x + .984375
  }
  if (easing === "elastic") {
    if (t === 0 || t === 1) return t
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1
  }
  if (easing === "custom" && custom) {
    const values = custom.match(/-?d*.?d+/g)?.map(Number)
    if (values && values.length >= 4) {
      const y1 = values[1], y2 = values[3], u = 1 - t
      return 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t
    }
  }
  return t
}

function parseTimelineColor(value:any) {
  const input = String(value || "#ffffff").trim()
  const short = input.match(/^#([0-9a-f]{3,4})$/i)
  if (short) {
    const hex = short[1]
    return [parseInt(hex[0] + hex[0],16), parseInt(hex[1] + hex[1],16), parseInt(hex[2] + hex[2],16), hex[3] ? parseInt(hex[3] + hex[3],16) / 255 : 1]
  }
  const full = input.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i)
  if (full) return [parseInt(full[1].slice(0,2),16), parseInt(full[1].slice(2,4),16), parseInt(full[1].slice(4,6),16), full[2] ? parseInt(full[2],16) / 255 : 1]
  const rgb = input.match(/^rgba?(([^)]+))$/i)
  if (rgb) {
    const values = rgb[1].split(",").map((part) => Number(part.trim()))
    return [values[0] || 0, values[1] || 0, values[2] || 0, Number.isFinite(values[3]) ? values[3] : 1]
  }
  return null
}

function mixTimelineValue(from:any, to:any, progress:number) {
  if (typeof from === "number" && typeof to === "number") return from + (to - from) * progress
  const a = parseTimelineColor(from), b = parseTimelineColor(to)
  if (a && b) {
    const mixed = a.map((value,index) => value + (b[index] - value) * progress)
    return "rgba(" + Math.round(mixed[0]) + "," + Math.round(mixed[1]) + "," + Math.round(mixed[2]) + "," + mixed[3].toFixed(3) + ")"
  }
  return progress < 1 ? from : to
}

function evaluateRuntimeTrack(track:any, time:number) {
  const keys = Array.isArray(track?.keyframes) ? [...track.keyframes].sort((a:any,b:any) => Number(a.time) - Number(b.time)) : []
  if (!keys.length) return undefined
  if (time <= Number(keys[0].time)) return keys[0].value
  if (time >= Number(keys[keys.length - 1].time)) return keys[keys.length - 1].value
  for (let index = 0; index < keys.length - 1; index++) {
    const from = keys[index], to = keys[index + 1]
    if (time < Number(from.time) || time > Number(to.time)) continue
    const span = Math.max(1, Number(to.time) - Number(from.time))
    const progress = timelineEase((time - Number(from.time)) / span, from.easing || "ease", from.customBezier)
    return mixTimelineValue(from.value, to.value, progress)
  }
  return keys[keys.length - 1].value
}

function useRuntimeTimeline(element:any, timeline:any, maxFps:number = 60) {
  const nodeRef = useRef<HTMLElement | null>(null)
  const bind = (node:HTMLElement | null) => { nodeRef.current = node }
  useEffect(() => {
    const tracks = Array.isArray(timeline?.tracks)
      ? timeline.tracks.filter((track:any) => track?.enabled !== false && track?.targetId === element.id && Array.isArray(track.keyframes) && track.keyframes.length)
      : []
    if (!timeline?.enabled || !timeline?.autoplay || !tracks.length || !nodeRef.current) return
    const node = nodeRef.current
    const duration = Math.max(100, Number(timeline.duration) || 4000)
    const fps = Math.max(1, Math.min(60, Number(timeline.fps) || 60, Number(maxFps) || 60))
    const frameInterval = 1000 / fps
    const started = performance.now()
    let frame = 0
    let stopped = false
    let lastPaint = -Infinity

    const paint = (time:number) => {
      const values:Record<string,any> = {}
      tracks.forEach((track:any) => { values[track.property] = evaluateRuntimeTrack(track, time) })
      const x = values.x ?? element.x ?? 50
      const y = values.y ?? element.y ?? 50
      const rotation = values.rotation ?? element.rotation ?? 0
      const scaleX = values.scaleX ?? element.scaleX ?? 1
      const scaleY = values.scaleY ?? element.scaleY ?? 1
      node.style.left = String(x) + "%"
      node.style.top = String(y) + "%"
      node.style.transform = "translate(-50%,-50%) rotate(" + rotation + "deg) skew(" + (element.skewX || 0) + "deg," + (element.skewY || 0) + "deg) scale(" + scaleX + "," + scaleY + ")"
      if (values.opacity !== undefined) node.style.opacity = String(Number(values.opacity) > 1 ? Number(values.opacity) / 100 : Number(values.opacity))
      if (values.width !== undefined) node.style.width = String(values.width) + "px"
      if (values.height !== undefined) node.style.height = String(values.height) + "px"
      if (values.fontSize !== undefined) node.style.fontSize = String(values.fontSize) + "px"
      if (values.letterSpacing !== undefined) node.style.letterSpacing = String(values.letterSpacing) + "px"
      if (values.borderRadius !== undefined) node.style.borderRadius = String(values.borderRadius) + "px"
      if (values.color !== undefined) node.style.color = String(values.color)
      if (values.bgColor !== undefined) node.style.background = String(values.bgColor)
    }

    const tick = (now:number) => {
      if (stopped) return
      const elapsed = now - started
      const time = timeline.loop ? elapsed % duration : Math.min(duration, elapsed)
      const finished = !timeline.loop && elapsed >= duration
      if (finished || now - lastPaint >= frameInterval - 1) {
        lastPaint = now
        paint(time)
      }
      if (!finished) frame = requestAnimationFrame(tick)
    }
    paint(0)
    frame = requestAnimationFrame(tick)
    return () => { stopped = true; cancelAnimationFrame(frame) }
  }, [element, timeline, maxFps])
  return bind
}

function RuntimeElement({ element, index, launcherAnimation, timeline, maxFps, onAction }: { element:any; index:number; launcherAnimation:any; timeline:any; maxFps:number; onAction:(element:any)=>void }) {
  const timelineTracks = Array.isArray(timeline?.tracks) ? timeline.tracks.filter((track:any) => track?.targetId === element.id && track?.enabled !== false && track?.keyframes?.length) : []
  const timelineActive = Boolean(timeline?.enabled && timeline?.autoplay && timelineTracks.length)
  const bindTimeline = useRuntimeTimeline(element, timeline, maxFps)
  const entry = element.entryAnimation || {}
  const baseTransform = "translate(-50%,-50%) rotate(" + (element.rotation || 0) + "deg) skew(" + (element.skewX || 0) + "deg," + (element.skewY || 0) + "deg) scale(" + (element.scaleX || 1) + "," + (element.scaleY || 1) + ")"
  const rawOpacity = typeof element.opacity === "number" ? element.opacity : 100
  const base: React.CSSProperties = {
    position:"absolute",
    left:String(element.x) + "%",
    top:String(element.y) + "%",
    zIndex:element.zIndex || 1,
    opacity:rawOpacity > 1 ? rawOpacity / 100 : rawOpacity,
    transform:baseTransform,
    ["--launcher-element-base-transform" as string]:baseTransform,
    animationName:!timelineActive && entry.type && entry.type !== "none" ? animationName(entry.type) : undefined,
    animationDuration:!timelineActive && entry.duration ? String(entry.duration) + "ms" : undefined,
    animationDelay:!timelineActive ? String((entry.delay || 0) + (launcherAnimation.stagger ? index * (launcherAnimation.staggerDelay || 0) : 0)) + "ms" : undefined,
    animationTimingFunction:!timelineActive ? animationEasing(entry) : undefined,
    animationFillMode:!timelineActive ? "both" : undefined,
    ...(!timelineActive ? animationVariables(entry, false) : {}),
  }
  const gradient = element.gradient?.enabled ? "linear-gradient(" + (element.gradient.angle || 90) + "deg," + (element.gradient.colors || []).map((item:any)=>item.color + " " + item.position + "%").join(",") + ")" : undefined
  const textStyle: React.CSSProperties = {
    fontSize:String(element.fontSize || 16) + "px",
    color:gradient ? "transparent" : (element.color || "#fff"),
    fontWeight:element.fontWeight || "400",
    fontFamily:element.fontFamily || "system-ui",
    fontStyle:element.fontStyle || "normal",
    textDecoration:element.textDecoration || "none",
    letterSpacing:typeof element.letterSpacing === "number" ? String(element.letterSpacing) + "px" : undefined,
    lineHeight:element.lineHeight || 1.2,
    textAlign:element.textAlign || "center",
    whiteSpace:"pre-wrap",
    backgroundImage:gradient,
    backgroundClip:gradient ? "text" : undefined,
    WebkitBackgroundClip:gradient ? "text" : undefined,
    ...textOutline(element),
  }

  if (element.type === "button") {
    const style = element.buttonStyle || "solid"
    const transparent = style === "outline" || style === "ghost" || style === "minimal"
    const icon = iconForButton(element)
    return <button ref={bindTimeline as any} onClick={() => onAction(element)} className={"launcher-button button-style-" + style + " button-hover-" + (element.hoverEffect || "lift")} style={{...base,...textStyle,width:String(element.width || 190)+"px",height:String(element.height || 52)+"px",color:element.color || "#050505",background:transparent?"transparent":(element.bgColor || "#fff"),borderRadius:style==="pill"?"999px":String(element.borderRadius || 0)+"px",border:style==="ghost"||style==="minimal"?"1px solid transparent":String(Math.max(style==="outline"?2:0,element.borderWidth || 0))+"px "+(element.borderStyle || "solid")+" "+(element.borderColor || element.color || "#fff"),boxShadow:element.shadowEnabled?String(element.shadowOffsetX || 0)+"px "+String(element.shadowOffsetY || 6)+"px "+String(element.shadowBlur || 0)+"px "+(element.shadowColor || "rgba(0,0,0,.35)"):style==="brutalist"?"7px 7px 0 "+(element.borderColor || "rgba(255,255,255,.16)"):undefined,filter:boxOutline(element)||undefined}}>{element.buttonIconPosition!=="right"&&icon&&<span>{icon}</span>}<span>{element.text || "JUGAR"}</span>{element.buttonIconPosition==="right"&&icon&&<span>{icon}</span>}</button>
  }
  if (element.type === "image" && element.src) {
    const fx=element.imageEffects || {}
    return <img ref={bindTimeline as any} src={element.src} alt="" style={{...base,width:element.width?String(element.width)+"px":"auto",height:element.height?String(element.height)+"px":"auto",objectFit:"contain",borderRadius:String(fx.borderRadius || 0)+"px",border:fx.borderWidth?String(fx.borderWidth)+"px "+(fx.borderStyle || "solid")+" "+(fx.borderColor || "#fff"):undefined,boxShadow:fx.shadow?.enabled?String(fx.shadow.offsetX)+"px "+String(fx.shadow.offsetY)+"px "+String(fx.shadow.blur)+"px "+String(fx.shadow.spread)+"px "+fx.shadow.color:undefined,filter:["brightness("+(fx.brightness??100)+"%)","contrast("+(fx.contrast??100)+"%)","saturate("+(fx.saturation??100)+"%)","blur("+(fx.blur??0)+"px)","grayscale("+(fx.grayscale??0)+"%)","sepia("+(fx.sepia??0)+"%)","hue-rotate("+(fx.hueRotate??0)+"deg)",fx.glow?.enabled?"drop-shadow(0 0 "+fx.glow.blur+"px "+fx.glow.color+")":"",boxOutline(element)].filter(Boolean).join(" ")}}/>
  }
  return <div ref={bindTimeline as any} style={{...base,...textStyle,width:element.width?String(element.width)+"px":undefined,minHeight:element.height?String(element.height)+"px":undefined,display:element.width||element.height?"flex":undefined,alignItems:element.height?"center":undefined,justifyContent:element.textAlign==="left"?"flex-start":element.textAlign==="right"?"flex-end":"center",overflowWrap:"anywhere"}}>{element.text || ""}</div>
}

function Splash({ splash, onDone }: { splash: any; onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter")
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const enter = Math.max(260, splash.logo?.animationDuration || 760)
    const duration = Math.max(enter + 320, splash.duration || 2400)
    const exit = Math.max(220, splash.exitDuration || 420)
    const a = window.setTimeout(() => setPhase("visible"), enter)
    const b = window.setTimeout(() => setPhase("exit"), duration)
    const c = window.setTimeout(onDone, duration + exit)
    return () => { window.clearTimeout(a); window.clearTimeout(b); window.clearTimeout(c) }
  }, [onDone, splash])

  const particles = Array.from({ length: Math.min(90, splash.particles?.amount || 0) }, (_, index) => ({
    left: String((index * 37 + 11) % 100) + "%",
    top: String((index * 61 + 7) % 100) + "%",
    delay: String(((index * 73) % 1300) / 1000) + "s",
    duration: String(Math.max(2.4, 8 - (splash.particles?.speed || 30) / 9 + (index % 5) * .35)) + "s",
    opacity: .16 + (index % 5) * .09,
  }))
  const bg = backgroundStyle(splash.background || {})
  const logoGradient = splash.logo?.gradient?.enabled
    ? (splash.logo.gradient.type || "linear") + "-gradient(" + (splash.logo.gradient.angle || 90) + "deg," + (splash.logo.gradient.colors || []).map((item: any) => item.color + " " + item.position + "%").join(",") + ")"
    : undefined
  const exitClass = phase === "exit" ? " exit-" + (splash.exitAnimation || "fadeOut") : ""

  return (
    <div
      className={"splash-root intro-" + (splash.introType || "cinematic") + " phase-" + phase + exitClass}
      onClick={() => splash.skippable && onDone()}
      style={{
        ...bg,
        ["--splash-accent" as string]: splash.accentColor || "#fff",
        ["--splash-secondary" as string]: splash.secondaryColor || "#777",
        ["--exit-ms" as string]: String(splash.exitDuration || 420) + "ms",
        ["--intro-fade-from" as string]: String(Number(splash.exitFade?.fromOpacity ?? 100) / 100),
        ["--intro-fade-to" as string]: String(Number(splash.exitFade?.toOpacity ?? 0) / 100),
        ["--intro-fade-blur" as string]: String(splash.exitFade?.blurAmount ?? 22) + "px",
        ["--intro-fade-scale" as string]: String(Number(splash.exitFade?.scaleFrom ?? 106) / 100),
        ["--intro-fade-x" as string]: String(splash.exitFade?.direction === "left" ? -(splash.exitFade?.distance || 64) : splash.exitFade?.direction === "right" ? splash.exitFade?.distance || 64 : 0) + "px",
        ["--intro-fade-y" as string]: String(splash.exitFade?.direction === "up" ? -(splash.exitFade?.distance || 64) : splash.exitFade?.direction === "down" ? splash.exitFade?.distance || 64 : 0) + "px",
        ["--intro-flash" as string]: String(Number(splash.exitFade?.flashBrightness ?? 190) / 100),
        ["--intro-wipe-out" as string]: splash.exitFade?.direction === "left" ? "inset(0 100% 0 0)" : splash.exitFade?.direction === "up" ? "inset(0 0 100% 0)" : splash.exitFade?.direction === "down" ? "inset(100% 0 0 0)" : "inset(0 0 0 100%)",
        ["--crt-on-ms" as string]: String(splash.tvEffect?.turnOnDuration || 900) + "ms",
        ["--crt-scan-opacity" as string]: String(Math.min(.32, Number(splash.tvEffect?.scanlineIntensity || 0) / 180)),
        ["--crt-flicker-opacity" as string]: String(Math.min(.18, Number(splash.tvEffect?.flickerIntensity || 0) / 350)),
        ["--crt-noise-opacity" as string]: String(Math.min(.28, Number(splash.tvEffect?.staticNoise || 0) / 180)),
        ["--crt-rgb" as string]: String(splash.tvEffect?.chromaticOffset || 0) + "px",
        ["--crt-curve" as string]: String(Math.min(26, splash.tvEffect?.curvature || 0)) + "px",
        ["--crt-roll-speed" as string]: String(Math.max(.8, 8 - Number(splash.tvEffect?.rollSpeed || 4) / 2)) + "s",
        ["--crt-beam" as string]: String(Math.max(.25, Number(splash.tvEffect?.beamIntensity || 70) / 100)),
        ["--crt-glow" as string]: String(Math.max(0, splash.tvEffect?.phosphorGlow || 0)) + "px",
      }}
    >
      {splash.background?.type === "image" && splash.background.imageUrl && (
        <div className="splash-bg-image" style={{ backgroundImage: "url(" + splash.background.imageUrl + ")", filter: "blur(" + (splash.background.blur || 0) + "px)" }} />
      )}
      {splash.particles?.enabled && (
        <div className={"splash-particles particles-" + splash.particles.shape}>
          {particles.map((particle, index) => (
            <span key={index} style={{ left:particle.left, top:particle.top, width:String(Math.max(1,splash.particles.size)) + "px", height:splash.particles.shape === "line" ? String(Math.max(8,splash.particles.size * 6)) + "px" : String(Math.max(1,splash.particles.size)) + "px", opacity:particle.opacity, animationDelay:particle.delay, animationDuration:particle.duration }} />
          ))}
        </div>
      )}
      {splash.introType === "tv" && <><div className="crt-shutter crt-shutter-top" /><div className="crt-shutter crt-shutter-bottom" /><div className="crt-beam" /><div className="crt-roll" /><div className="crt-phosphor" /><div className="splash-static" /><div className="splash-lines" /></>}
      {splash.introType === "terminal" && <div className="splash-terminal"><span>BOOT::LAUNCHER_RUNTIME</span><span>ASSET_PIPELINE::READY</span><span>INSTANCE::{splash.logo?.text || "UNTITLED"}</span></div>}
      <div className="splash-ring" />
      <div className="splash-content">
        <div className={"splash-logo logo-" + (splash.logo?.animation || "clipReveal")} style={{ animationDuration:String(splash.logo?.animationDuration || 760) + "ms", animationTimingFunction:animationEasing(splash.logo?.fade || {}), ...animationVariables(splash.logo?.fade || {}, false) }}>
          {splash.logo?.type === "image" && splash.logo.imageUrl ? (
            <img src={splash.logo.imageUrl} alt="Logo" style={{ maxWidth:"72vw", maxHeight:String(splash.logo.imageSize || 124) + "px" }} />
          ) : (
            <span
              data-text={splash.logo?.text}
              style={{
                fontSize:String(splash.logo?.fontSize || 48) + "px",
                fontFamily:splash.logo?.fontFamily || "ui-monospace",
                fontWeight:splash.logo?.fontWeight || "800",
                color:logoGradient ? "transparent" : (splash.logo?.color || "#fff"),
                letterSpacing:String(splash.letterSpacing || 0) + "px",
                backgroundImage:logoGradient,
                backgroundClip:logoGradient ? "text" : undefined,
                WebkitBackgroundClip:logoGradient ? "text" : undefined,
                filter:splash.logo?.glow?.enabled ? "drop-shadow(0 0 " + splash.logo.glow.blur + "px " + splash.logo.glow.color + ")" : undefined,
              }}
            >{splash.logo?.text}</span>
          )}
        </div>
        {splash.subtitle?.enabled && <p className="splash-subtitle" style={{ color:splash.subtitle.color, fontSize:String(splash.subtitle.fontSize || 10) + "px", animationDelay:String(splash.subtitle.delay || 0) + "ms" }}>{splash.subtitle.text}</p>}
        {splash.progressBar?.enabled && <div className="splash-progress" style={{ width:String(splash.progressBar.width || 190) + "px", height:String(splash.progressBar.height || 2) + "px" }}><i style={{ backgroundColor:splash.progressBar.color || "#fff", animationDuration:String(Math.max(500,(splash.duration || 2400)-180)) + "ms" }} /></div>}
      </div>
      {splash.skippable && <span className="splash-skip">CLICK / ENTER PARA SALTAR</span>}
    </div>
  )
}

export default function LauncherPage() {
  const splash = (config as any).splashScreen || { enabled:false }
  const [showSplash, setShowSplash] = useState(Boolean(splash.enabled))
  const [selectedServer, setSelectedServer] = useState(0)
  const advanced = (config as any).advanced || {}
  const shader = (config as any).shaderEffects || { enabled:false }
  const servers = Array.isArray((config as any).servers) ? (config as any).servers : []
  const pages = Array.isArray((config as any).pages) ? (config as any).pages : []
  const pageTransition = (config as any).pageTransition || { type:"fade", duration:260 }
  const [activePageId, setActivePageId] = useState("main")
  const currentPage = activePageId === "main" ? null : pages.find((page:any) => page.id === activePageId) || null
  const elements = currentPage && Array.isArray(currentPage.elements) ? currentPage.elements : (Array.isArray((config as any).elements) ? (config as any).elements : [])
  const serverButtons = (config as any).serverButtons || {}
  const social = (config as any).socialLinks || { enabled:false, links:{} }
  const launcherAnimation = (config as any).launcherAnimation || { enabled:false }
  const timeline = currentPage?.timeline || (config as any).timeline || { enabled:false, autoplay:true, duration:4000, loop:false, tracks:[] }

  useEffect(() => {
    if (!advanced.customCodeEnabled || !advanced.customJs) return
    try {
      const run = new Function(advanced.customJs)
      run()
      window.dispatchEvent(new CustomEvent("launcher:ready"))
    } catch (error) {
      console.error("Custom JS error:", error)
    }
  }, [advanced.customCodeEnabled, advanced.customJs])

  useEffect(() => {
    const syncPageFromHash = () => {
      const slug = window.location.hash.replace(/^#/, "")
      if (!slug) {
        setActivePageId("main")
        return
      }
      const page = pages.find((item:any) => item.slug === slug)
      setActivePageId(page?.id || "main")
    }
    syncPageFromHash()
    window.addEventListener("hashchange", syncPageFromHash)
    return () => window.removeEventListener("hashchange", syncPageFromHash)
  }, [])

  const navigateToPage = (targetId:string) => {
    if (targetId === "main") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
      setActivePageId("main")
      return
    }
    const target = pages.find((page:any) => page.id === targetId)
    if (!target) return
    window.location.hash = target.slug || target.id
    setActivePageId(target.id)
  }

  const play = () => {
    const server = servers[selectedServer] || servers[0]
    if (!server) return
    const address = String(server.ip || "") + ":" + String(server.port || "19132")
    const protocol = String(advanced.launchProtocol || "minecraft://")
    if (protocol.includes("connect")) {
      window.location.href = protocol + encodeURIComponent(address)
      return
    }
    window.location.href = "minecraft://connect/?serverUrl=" + encodeURIComponent(server.ip || "") + "&serverPort=" + encodeURIComponent(server.port || "19132")
  }

  const handleElementAction = (element:any) => {
    const action = element.actionType || ((String(element.text || "").toUpperCase().includes("JUGAR") || String(element.text || "").toUpperCase().includes("PARTIDA") || String(element.text || "").toUpperCase().includes("CONNECT")) ? "launch" : "none")
    if (action === "launch") {
      play()
      return
    }
    if (action === "internal" && element.actionTarget) {
      navigateToPage(String(element.actionTarget))
      return
    }
    if (action === "external" && element.externalUrl) {
      if (element.openInNewTab) window.open(String(element.externalUrl), "_blank", "noopener,noreferrer")
      else window.location.href = String(element.externalUrl)
    }
  }

  const shaderFilter = shader.enabled
    ? "blur(" + (shader.blur || 0) + "px) brightness(" + (shader.brightness || 100) + "%) contrast(" + (shader.contrast || 100) + "%) saturate(" + (shader.saturation || 100) + "%) hue-rotate(" + (shader.hueRotate || 0) + "deg) grayscale(" + (shader.grayscale || 0) + "%) sepia(" + (shader.sepia || 0) + "%)"
    : undefined
  const bg = currentPage?.background || (config as any).background || {}
  const stageShadow = shader.enabled
    ? [shader.bloom > 0 ? "inset 0 0 " + shader.bloom * 2 + "px " + shader.bloomColor : "", shader.edgeGlow > 0 ? "inset 0 0 " + shader.edgeGlow * 2 + "px " + shader.edgeColor : ""].filter(Boolean).join(",")
    : undefined

  if (showSplash) return <Splash splash={splash} onDone={() => setShowSplash(false)} />

  return (
    <main className="launcher-root">
      <section className={"launcher-shell " + (shader.animated ? "shader-animated" : "")} style={{ ...backgroundStyle(bg), ["--shader-speed" as string]:String(Math.max(2,110-(shader.animationSpeed || 30))) + "s" }}>
        {bg.type === "image" && bg.imageUrl && <div className="launcher-background-image" style={{ backgroundImage:"url(" + bg.imageUrl + ")", filter:"blur(" + (bg.blur || 0) + "px)" }} />}
        {bg.type === "image" && bg.overlayOpacity > 0 && <div className="launcher-overlay" style={{ zIndex:1, background:"rgba(0,0,0," + bg.overlayOpacity/100 + ")" }} />}

        <div
          key={activePageId}
          className={"launcher-stage " + (pageTransition.type !== "none" ? "page-transition-" + pageTransition.type : "")}
          style={{
            ["--page-transition-ms" as string]:String(pageTransition.duration || 260) + "ms",
            zIndex:2,
            filter:shaderFilter,
            boxShadow:stageShadow || undefined,
            imageRendering:shader.enabled && shader.pixelate > 0 ? "pixelated" : undefined,
            clipPath:shader.enabled && shader.lensDistortion > 0 ? "inset(" + shader.lensDistortion/8 + "% round " + shader.lensDistortion/2 + "px)" : undefined,
            animation:launcherAnimation.enabled ? animationName(launcherAnimation.type) + " " + (launcherAnimation.duration || 600) + "ms " + animationEasing(launcherAnimation) + " " + (launcherAnimation.delay || 0) + "ms both" : undefined,
            ...animationVariables(launcherAnimation, false),
          }}
        >
          {elements.filter((element:any) => element.visible !== false).sort((a:any,b:any)=>(a.zIndex||0)-(b.zIndex||0)).map((element:any,index:number) => (
            <RuntimeElement key={element.id} element={element} index={index} launcherAnimation={launcherAnimation} timeline={timeline} maxFps={Number(advanced.maxFps) || 60} onAction={handleElementAction} />
          ))}

          <div style={{ position:"absolute", left:String(serverButtons.offsetX || 7) + "%", top:String(serverButtons.offsetY || 52) + "%", transform:"translateY(-50%)", display:"flex", flexDirection:serverButtons.orientation === "horizontal" ? "row" : "column", gap:String(serverButtons.spacing || 10) + "px", zIndex:40 }}>
            {servers.map((server:any,index:number) => {
              const selected = index === selectedServer
              const radius = serverButtons.style === "circle" ? "50%" : serverButtons.style === "rounded" ? "14px" : "2px"
              return <button key={server.id || index} onClick={() => setSelectedServer(index)} title={server.name} style={{ width:String(serverButtons.width || serverButtons.size || 44) + "px", height:String(serverButtons.height || serverButtons.size || 44) + "px", display:"grid", placeItems:"center", overflow:"hidden", borderRadius:radius, border:String(serverButtons.borderWidth || 1) + "px solid " + (serverButtons.borderColor || "#777"), color:"#fff", background:serverButtons.glassEffect ? "rgba(255,255,255," + ((serverButtons.glassOpacity || 15)/100) + ")" : (serverButtons.bgColor || "#050505"), backdropFilter:serverButtons.glassEffect ? "blur(" + (serverButtons.glassBlur || 12) + "px)" : undefined, boxShadow:selected || serverButtons.glow?.enabled ? "0 0 " + (serverButtons.glow?.blur || serverButtons.shadowBlur || 18) + "px " + (serverButtons.glow?.color || serverButtons.shadowColor || "#fff") : undefined, cursor:"pointer", transition:"transform .18s ease,box-shadow .18s ease" }}>{server.imageUrl ? <img src={server.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <span style={{fontWeight:900}}>{String(server.name || "S").slice(0,1).toUpperCase()}</span>}</button>
            })}
          </div>

          {advanced.customCodeEnabled && advanced.customHtml && <div className="launcher-custom-html" dangerouslySetInnerHTML={{ __html:advanced.customHtml }} />}
        </div>

        {shader.enabled && shader.overlayOpacity > 0 && <div className="launcher-overlay" style={{ zIndex:70, background:shader.overlayColor, opacity:shader.overlayOpacity/100, mixBlendMode:shader.blendMode || "normal" }} />}
        {shader.enabled && shader.grain > 0 && <div className="shader-grain" style={{opacity:shader.grain/100}} />}
        {shader.enabled && shader.scanlines > 0 && <div className="shader-scanlines" style={{opacity:Math.min(shader.scanlines/40,.55)}} />}
        {shader.enabled && shader.dither > 0 && <div className="shader-dither" style={{opacity:shader.dither/100}} />}
        {shader.enabled && shader.halftone > 0 && <div className="shader-halftone" style={{opacity:shader.halftone/100}} />}
        {shader.enabled && shader.lightLeak > 0 && <div className="shader-light-leak" style={{opacity:shader.lightLeak/100,background:"radial-gradient(circle at 18% 12%," + shader.lightLeakColor + " 0,transparent 42%),radial-gradient(circle at 92% 82%," + shader.lightLeakColor + " 0,transparent 38%)"}} />}
        {shader.enabled && shader.fog > 0 && <div className="shader-fog" style={{opacity:shader.fog/100,background:"radial-gradient(ellipse at 20% 70%," + shader.fogColor + " 0,transparent 50%),radial-gradient(ellipse at 80% 30%," + shader.fogColor + " 0,transparent 48%)"}} />}
        {shader.enabled && shader.pixelate > 0 && <div className="shader-pixel-grid" style={{opacity:Math.min(.28,shader.pixelate/45),backgroundSize:String(Math.max(3,shader.pixelate)) + "px " + String(Math.max(3,shader.pixelate)) + "px"}} />}
        {shader.enabled && shader.vignette > 0 && <div className="launcher-overlay" style={{zIndex:79,background:"radial-gradient(circle at center,transparent " + Math.max(12,shader.vignetteFeather || 52) + "%,rgba(0,0,0," + shader.vignette/100 + ") 100%)"}} />}
        {shader.enabled && shader.chromaticAberration > 0 && <div className="launcher-overlay" style={{zIndex:80,boxShadow:String(shader.chromaticAberration) + "px 0 0 rgba(255,0,80,.18)," + String(-shader.chromaticAberration) + "px 0 0 rgba(0,220,255,.18) inset",mixBlendMode:"screen"}} />}

        {social.enabled && <nav style={{position:"absolute",zIndex:90,display:"flex",gap:8,top:social.position?.startsWith("top") ? 18 : undefined,bottom:social.position?.startsWith("bottom") ? 18 : undefined,left:social.position?.endsWith("left") ? 18 : undefined,right:social.position?.endsWith("right") ? 18 : undefined}}>{Object.entries(social.links || {}).filter(([,value])=>Boolean(value)).map(([name,value])=><a key={name} href={String(value)} target="_blank" rel="noreferrer" style={{minWidth:42,height:42,padding:social.style === "pills" ? "0 14px" : 0,display:"grid",placeItems:"center",border:"1px solid rgba(255,255,255,.35)",borderRadius:social.style === "pills" ? 999 : 4,color:"#fff",background:"rgba(0,0,0,.45)",backdropFilter:"blur(12px)",fontSize:11,textTransform:"uppercase",textDecoration:"none"}}>{social.style === "pills" ? name : name.slice(0,1).toUpperCase()}</a>)}</nav>}

        {advanced.customCss && <style>{advanced.customCss}</style>}
      </section>
    </main>
  )
}
