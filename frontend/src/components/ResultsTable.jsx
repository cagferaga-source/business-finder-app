import React from 'react';

function ResultsTable({ businesses }) {
  if (businesses.length === 0) {
    return (
      <div className="info-message">
        📍 Arama yapın ve sonuçlar burada listelenecektir.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="results-table">
        <thead>
          <tr>
            <th>Firma Adı</th>
            <th>Adres</th>
            <th>Telefon</th>
            <th>E-mail</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business, idx) => (
            <tr key={idx}>
              <td title={business.name}>{business.name}</td>
              <td title={business.address}>{business.address?.substring(0, 30)}</td>
              <td>{business.phone || '-'}</td>
              <td style={{ 
                color: business.email ? '#27ae60' : '#e74c3c', 
                fontWeight: 600,
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {business.email || 'Bulunamadı'}
              </td>
              <td>
                <span className={`status-badge ${business.email ? 'status-success' : 'status-warning'}`}>
                  {business.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
        Toplam: {businesses.length} işletme
      </p>
    </div>
  );
}

export default ResultsTable;
