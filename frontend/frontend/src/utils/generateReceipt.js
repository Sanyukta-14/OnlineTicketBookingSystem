import jsPDF from "jspdf";
import QRCode from "qrcode";

const generateReceipt = async (booking, event, user) => {
  const doc = new jsPDF("portrait", "mm", "a4");

  // Generate QR Code
  const qrData = `
Booking ID : ${booking.id}
Customer   : ${user.name}
Event      : ${event.eventName}
Tickets    : ${booking.numberOfTickets}
Status     : ${booking.status}
`;

  const qrImage = await QRCode.toDataURL(qrData);

  // Background
  doc.setFillColor(240, 247, 255);
  doc.rect(10, 10, 190, 120, "F");

  // Border
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  doc.roundedRect(10, 10, 190, 120, 5, 5);

  // Title
  doc.setFillColor(37, 99, 235);
  doc.rect(10, 10, 190, 18, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ONLINE TICKET BOOKING SYSTEM", 20, 22);

  doc.setTextColor(0, 0, 0);

  let y = 40;

  const row = (label, value) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);

    doc.setFont("helvetica", "normal");
    doc.text(String(value), 75, y);

    y += 10;
  };

  row("Booking ID", booking.id);
  row("Customer", user.name);
  row("Email", user.email);
  row("Event", event.eventName);
  row("Location", event.location);
  row("Event Date", event.eventDate);
  row("Tickets", booking.numberOfTickets);
  row("Ticket Price", `₹${event.ticketPrice}`);
  row("Total Amount", `₹${booking.totalAmount}`);
  row("Status", booking.status);

  // QR Code
  doc.addImage(qrImage, "PNG", 145, 42, 40, 40);

  // Footer
  doc.setDrawColor(180);
  doc.line(20, 118, 190, 118);

  doc.setFontSize(11);
  doc.setTextColor(100);

  doc.text(
    "Please carry this ticket during the event.",
    20,
    126
  );

  doc.save(`Ticket_${booking.id}.pdf`);
};

export default generateReceipt;