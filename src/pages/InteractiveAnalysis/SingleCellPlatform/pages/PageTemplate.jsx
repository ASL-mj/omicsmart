import styles from './PageTemplate.module.css';

const PageTemplate = ({ title, description, children }) => {
  return (
    <div className={styles.pageTemplate}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{title}</h2>
        {description && <p className={styles.pageDescription}>{description}</p>}
      </div>
      <div className={styles.pageBody}>
        {children || (
          <div className={styles.emptyContent}>
            <p>页面内容开发中...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTemplate;