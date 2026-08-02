import { jsPDF } from "jspdf";
import type { Trip } from "../context/store";

/**
 * Export trip details and day-by-day itinerary to PDF.
 */
export function exportItineraryToPDF(trip: Trip) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  // Helper to add new page if content overflows
  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      
      // Page background style for new page
      doc.setFillColor(250, 250, 250);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      
      // Footer on new page
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setFillColor(150, 150, 150);
      doc.text("Multi-Agent AI Travel Planner - Generated with Antigravity", pageWidth / 2, pageHeight - 10, { align: "center" });
    }
  };

  // Initial page background color (light grey tint)
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Title Card
  doc.setFillColor(99, 102, 241); // Indigo Primary
  doc.rect(0, 0, pageWidth, 55, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(28);
  doc.text(trip.destination, margin, 24);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`A personalized ${trip.preferences.style.toLowerCase()} journey for ${trip.travelers.count} traveler(s)`, margin, 32);
  doc.text(`Dates: ${new Date(trip.dates.start).toLocaleDateString()} to ${new Date(trip.dates.end).toLocaleDateString()}`, margin, 38);
  doc.text(`Total Budget: $${trip.budget}`, margin, 44);

  y = 65;

  // Destination Description Card
  checkPageOverflow(30);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 25, 3, 3, "F");
  
  doc.setTextColor(50, 50, 50);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Destination Insights:", margin + 5, y + 6);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const splitDesc = doc.splitTextToSize(trip.destination_info?.description || "", pageWidth - (margin * 2) - 10);
  doc.text(splitDesc, margin + 5, y + 12);
  y += 32;

  // Accommodation Card
  const hotelList = Array.isArray(trip.hotels)
    ? trip.hotels
    : trip.hotels?.hotels || [];
  const primaryHotel = hotelList[0];
  if (primaryHotel) {
    const hotel = primaryHotel;
    checkPageOverflow(35);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 30, 3, 3, "F");
    
    doc.setTextColor(99, 102, 241);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Accommodation (Primary recommendation):", margin + 5, y + 6);
    
    doc.setTextColor(50, 50, 50);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text(hotel.name, margin + 5, y + 12);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Address: ${hotel.address}`, margin + 5, y + 17);
    doc.text(`Rating: ${hotel.rating} / 5  |  Price: ~$${hotel.price_per_night} per night`, margin + 5, y + 22);
    doc.text(`Amenities: ${hotel.amenities?.slice(0, 4).join(", ") || ""}`, margin + 5, y + 27);
    y += 37;
  }

  // Day by Day itinerary title
  checkPageOverflow(15);
  doc.setTextColor(30, 30, 30);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Your Daily Schedule", margin, y + 5);
  y += 12;

  // Map each day
  trip.itinerary?.days?.forEach((day: any) => {
    // Add Day Header
    checkPageOverflow(45);
    doc.setFillColor(240, 244, 255);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 10, 2, 2, "F");
    
    doc.setTextColor(99, 102, 241);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Day ${day.day_number}: ${day.date} - ${day.theme}`, margin + 5, y + 6.5);
    y += 13;

    // Morning Slot
    if (day.morning && day.morning.length > 0) {
      checkPageOverflow(20);
      doc.setTextColor(100, 100, 100);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("MORNING", margin + 2, y + 3);
      
      doc.setTextColor(40, 40, 40);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${day.morning[0].time} - ${day.morning[0].title}`, margin + 22, y + 3);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      const splitText = doc.splitTextToSize(day.morning[0].description, pageWidth - (margin * 2) - 25);
      doc.text(splitText, margin + 22, y + 8);
      y += 8 + (splitText.length * 4) + 2;
    }

    // Afternoon Slot
    if (day.afternoon && day.afternoon.length > 0) {
      day.afternoon.forEach((slot: any) => {
        checkPageOverflow(20);
        doc.setTextColor(100, 100, 100);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.text("AFTERNOON", margin + 2, y + 3);
        
        doc.setTextColor(40, 40, 40);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${slot.time} - ${slot.title}`, margin + 22, y + 3);
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        const splitText = doc.splitTextToSize(slot.description, pageWidth - (margin * 2) - 25);
        doc.text(splitText, margin + 22, y + 8);
        y += 8 + (splitText.length * 4) + 2;
      });
    }

    // Evening Slot
    if (day.evening && day.evening.length > 0) {
      day.evening.forEach((slot: any) => {
        checkPageOverflow(20);
        doc.setTextColor(100, 100, 100);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.text("EVENING", margin + 2, y + 3);
        
        doc.setTextColor(40, 40, 40);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${slot.time} - ${slot.title}`, margin + 22, y + 3);
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        const splitText = doc.splitTextToSize(slot.description, pageWidth - (margin * 2) - 25);
        doc.text(splitText, margin + 22, y + 8);
        y += 8 + (splitText.length * 4) + 4;
      });
    }
    y += 4;
  });

  // Footer stamp
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Multi-Agent AI Travel Planner - Generated with Antigravity", pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save(`${trip.destination.replace(/[^a-zA-Z0-9]/g, "_")}_itinerary.pdf`);
}

/**
 * Generate and download an .ics file for calendar sync.
 */
export function exportItineraryToICS(trip: Trip) {
  let icsString = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Multi Agent Travel Planner//NONSGML Itinerary Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ].join("\r\n");

  const escapeString = (str: string) => {
    return str.replace(/[,;]/g, "\\$&").replace(/\n/g, "\\n");
  };

  // Helper to parse date string into ICS format YYYYMMDD
  const formatICSDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${yr}${mo}${da}`;
  };

  trip.itinerary?.days?.forEach((day: any) => {
    const slots = [
      ...(day.morning || []).map((s: any) => ({ ...s, period: 'MORNING' })),
      ...(day.afternoon || []).map((s: any) => ({ ...s, period: 'AFTERNOON' })),
      ...(day.evening || []).map((s: any) => ({ ...s, period: 'EVENING' }))
    ];

    slots.forEach((slot: any) => {
      const dateICS = formatICSDate(day.date);
      
      // Extract hour/minutes from slot time (e.g. "09:00 AM")
      const timeMatch = slot.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hourStr = "09";
      let minStr = "00";
      
      if (timeMatch) {
        let hr = parseInt(timeMatch[1]);
        const mn = timeMatch[2];
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === "PM" && hr < 12) hr += 12;
        if (ampm === "AM" && hr === 12) hr = 0;
        hourStr = String(hr).padStart(2, '0');
        minStr = String(mn).padStart(2, '0');
      }

      const startICS = `${dateICS}T${hourStr}${minStr}00`;
      // Default duration is 2 hours
      const endHour = String((parseInt(hourStr) + 2) % 24).padStart(2, '0');
      const endICS = `${dateICS}T${endHour}${minStr}00`;

      const uid = `event_${day.day_number}_${hourStr}_${minStr}_${Date.now()}@travelplanner.ai`;

      const eventLines = [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${formatICSDate(new Date().toISOString())}T120000Z`,
        `DTSTART;TZID=UTC:${startICS}`,
        `DTEND;TZID=UTC:${endICS}`,
        `SUMMARY:${escapeString(slot.title)}`,
        `DESCRIPTION:${escapeString(slot.description + " (Estimated cost: $" + (slot.cost || 0) + ")")}`,
        `LOCATION:${escapeString(slot.location_name || trip.destination)}`,
        "END:VEVENT"
      ];

      icsString += "\r\n" + eventLines.join("\r\n");
    });
  });

  icsString += "\r\nEND:VCALENDAR";

  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${trip.destination.replace(/[^a-zA-Z0-9]/g, "_")}_calendar.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
