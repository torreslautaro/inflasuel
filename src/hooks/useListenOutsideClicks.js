const useListenOutsideClicks = (listening,
  setListening,
  menuRef,
  setIsOpen) => {
      
      if (listening) return
      if (!menuRef.current) return
      setListening(true)
      ;[`click`, `touchstart`].forEach((type) => {
        return document.addEventListener(`click`, (evt) => {
          console.log('hola')
          const cur = menuRef.current
          const node = evt.target
          if (cur.contains(node)) return
          setIsOpen(false)
        })
      })
    
  }

  export default useListenOutsideClicks