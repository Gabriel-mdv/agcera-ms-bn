class SalesServices {
  static async getSales() {
    const sales = await fetch('http://localhost:3000/sales')
    return sales.json()
  }
}

export default SalesServices
