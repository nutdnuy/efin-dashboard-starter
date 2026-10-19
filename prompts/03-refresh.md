# อัปเดตข้อมูล

อ่าน docs/data-contract.md แล้วตรวจไฟล์ [พาธ CSV] เทียบ dashboard.config.json
ทดสอบด้วย npm run refresh -- [พาธ CSV] ตรวจวันที่ ข้อมูลซ้ำ ค่าไม่ถูกต้อง หุ้นที่ขาด และ Benchmark
หากข้อมูลไม่ผ่านให้คง snapshot เดิม อย่าเปลี่ยนไปใช้เดโมโดยเงียบ ๆ
รายงาน source, asOf, changed, coverage และ warnings ตาม templates/refresh-report.md
คำสั่งนี้เป็นการอัปเดตหนึ่งรอบ ไม่ใช่การเปิดตั้งเวลาจริง
