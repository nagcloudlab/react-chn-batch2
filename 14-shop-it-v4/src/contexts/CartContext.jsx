

import { createContext, useState } from 'react'

export const CartContext = createContext({
    cart: [],
    dispatch: () => { }
})

