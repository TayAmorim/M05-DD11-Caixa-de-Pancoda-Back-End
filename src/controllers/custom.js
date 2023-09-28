const knex = require("../conection");

const customReport = async (req, res) => {
  const currentDate = new Date().toISOString();
  const chargesBd = await knex("charges").orderBy(
    "charges.id_charges",
    " desc"
  );

  const clientsWithStatus = await knex("customers")
    .select(
      "customers.id",
      "customers.name_client",
      "customers.email_client",
      "customers.cpf_client",
      "customers.phone_client",
      knex.raw(
        "COUNT(CASE WHEN charges.id_charges IS NOT NULL THEN 1 ELSE NULL END) > 0 as status"
      )
    )
    .leftJoin("charges", function () {
      this.on("charges.id_customer", "=", "customers.id")
        .andOn(knex.raw("charges.status = ?", [true]))
        .andOn(knex.raw("charges.due_date < ?", [currentDate]));
    })
    .groupBy("customers.id")
    .orderBy("customers.id", "desc");

  function chargesCategories(charges, statusFilter, dateFilter) {
    const result = charges.reduce(
      (accumulator, charge) => {
        if (charge.status === statusFilter && dateFilter(charge.due_date)) {
          accumulator.charges.push({
            id_charge: charge.id_charges,
            name_client: charge.name_client,
            amount: charge.amount,
          });
          accumulator.amount += charge.amount || 0;
        }
        return accumulator;
      },
      { amount: 0, total: 0, charges: [] }
    );
    result.total = result.charges.length;
    result.charges = result.charges.slice(0, 4);
    return result;
  }

  const paid = chargesCategories(chargesBd, false, () => true);
  const preview = chargesCategories(
    chargesBd,
    true,
    (dueDate) => new Date(dueDate) > new Date(currentDate)
  );
  const overdue = chargesCategories(
    chargesBd,
    true,
    (dueDate) => new Date(dueDate) < new Date(currentDate)
  );

  function clientsStatus(customers, statusFilter) {
    let result = customers.reduce(
      (accumulator, client) => {
        if (client.status === statusFilter) {
          accumulator.clients.push({
            id: client.id,
            name_client: client.name_client,
            cpf_client: client.cpf_client,
          });
        }
        return accumulator;
      },

      { total: 0, clients: [] }
    );
    result.total = result.clients.length;
    result.clients = result.clients.slice(0, 4);
    return result;
  }

  const defaulters = clientsStatus(clientsWithStatus, true);
  const compliant = clientsStatus(clientsWithStatus, false);

  const chargesReport = { paid, preview, overdue };
  const customersReport = { defaulters, compliant };

  res.json({ chargesReport, customersReport });
};

module.exports = customReport;
