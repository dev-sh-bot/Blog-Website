import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { ArchiveIcon, ArrowUpRightIcon, CheckIcon, ClockIcon, FileTextIcon, FolderIcon } from "@/components/icons";
import { ensureAdminPage } from "@/lib/admin-page";
import { getAdminCounts, getAdminPosts } from "@/lib/data";
import { isFirebaseConfigured } from "@/lib/config";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  await ensureAdminPage();
  const counts = await getAdminCounts();
  const posts = (await getAdminPosts()).slice(0, 5);
  const notifications = [
    { text: counts.drafts > 0 ? `${counts.drafts} draft${counts.drafts === 1 ? "" : "s"} waiting for review.` : "No drafts are waiting for review.", icon: FileTextIcon, tone: "orange" },
    { text: counts.scheduled > 0 ? `${counts.scheduled} scheduled post${counts.scheduled === 1 ? "" : "s"} queued for publication.` : "No scheduled posts are queued.", icon: ClockIcon, tone: "blue" },
    { text: counts.archived > 0 ? `${counts.archived} archived post${counts.archived === 1 ? "" : "s"} hidden from the publication.` : "The archive is clear.", icon: ArchiveIcon, tone: "slate" },
  ];
  const stats = [
    { label: "Total posts", value: counts.total, note: "Across your publication", icon: FileTextIcon, tone: "blue" },
    { label: "Published", value: counts.published, note: "Live on the website", icon: CheckIcon, tone: "green" },
    { label: "Drafts", value: counts.drafts, note: "Need editorial attention", icon: ClockIcon, tone: "orange" },
    { label: "Categories", value: counts.categories, note: "Topics in your journal", icon: FolderIcon, tone: "purple" },
  ];

  return (
    <AdminShell title="Good morning, editor." description="Here’s what is happening across your publication.">
      {!isFirebaseConfigured && <div className="admin-notice" style={{ marginBottom: 20 }}>Demo mode is active because Firebase credentials are not configured. Connect Firebase using README.md to enable secure persistence and authentication.</div>}

      <div className="admin-stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <div className="stat-card" key={stat.label}>
            <div className="stat-card-top"><span>{stat.label}</span><span className={`stat-card-icon ${stat.tone}`}><Icon size={17} /></span></div>
            <strong>{stat.value}</strong>
            <small>{stat.note}</small>
          </div>;
        })}
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-card dashboard-signals">
          <div className="section-heading"><div><span className="eyebrow">Notifications</span><h2>Editorial signals</h2></div><span className="section-heading-icon"><ClockIcon size={18} /></span></div>
          <ul className="notification-list">
            {notifications.map((notification) => { const Icon = notification.icon; return <li key={notification.text}><span className={`notification-icon ${notification.tone}`}><Icon size={16} /></span><span>{notification.text}</span><ArrowUpRightIcon size={15} /></li>; })}
          </ul>
        </section>

        <section className="admin-card dashboard-shortcut">
          <span className="eyebrow">Quick start</span>
          <h2>Ready to share an idea?</h2>
          <p>Open a fresh draft and keep your next story moving through the editorial queue.</p>
          <Link className="button button-dark" href="/admin/posts/new"><FileTextIcon size={16} /><span>Write an article</span><ArrowUpRightIcon size={15} /></Link>
        </section>
      </div>

      <section className="admin-card dashboard-recent">
        <div className="section-heading"><div><span className="eyebrow">Editorial queue</span><h2>Recent articles</h2></div><Link className="text-link" href="/admin/posts">Manage all <ArrowUpRightIcon size={15} /></Link></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Updated</th></tr></thead><tbody>{posts.map((post) => <tr key={post.id}><td><Link href={`/admin/posts/${post.id}/edit`}><strong>{post.title}</strong><small>{post.slug}</small></Link></td><td>{post.category.name}</td><td><span className={`status-pill status-${post.status}`}>{post.status}</span></td><td>{new Date(post.updatedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>
      </section>
    </AdminShell>
  );
}
