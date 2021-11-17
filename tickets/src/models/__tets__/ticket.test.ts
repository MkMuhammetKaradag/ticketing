import { Ticket } from "../ticket";

it("implements  optimistic  concurrency  constrol", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 5,
    userId: "123",
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("should  nor reach  this point");
});

it("incerement  the version  number  on  multiple  saves", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 5,
    userId: "123",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
